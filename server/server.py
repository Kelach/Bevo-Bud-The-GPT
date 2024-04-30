
from flask import Flask, request, jsonify
from peft import PeftModel, PeftConfig
from transformers import AutoModelForCausalLM, AutoTokenizer, pipeline
from flask_cors import CORS
from redis import Redis
import os
import json
from datetime import datetime as time
# initialize model and tokenizer
config = PeftConfig.from_pretrained("Kelechie/Bevo-Budv1.0")
model = AutoModelForCausalLM.from_pretrained("distilbert/distilgpt2")
model = PeftModel.from_pretrained(model, "Kelechie/Bevo-Budv1.0")

# initialize redis db
db = Redis(host="db", port=os.environ.get("REDIS_PORT", 6379), db=0, decode_responses=True)

# model = "Kelechie/Bevo-BudGPT"
# model_checkpoint = "distilgpt2"
# tokenizer = AutoTokenizer.from_pretrained(model_checkpoint, use_fast=True)
generator = pipeline(model="Kelechie/Bevo-Budv1.0", pad_token_id = 50256) # pad_token_id set for open-end generation

app = Flask(__name__)
CORS(app) # enables cross-origin requests from client service

# load model and make a request using pipline
@app.route("/question", methods=["POST"])
def question():
    """
    Handles message queries
    -------
    - requires question id for question deletion
    - returns inference text response or boolean if conversation is deleted
    """
    if request.method == "POST":
        data = request.get_json()
        if "question" not in data:
            return jsonify({"error": "'question' is required"}), 400
        
        
        #TODO: consider structuring prompt before passing  
        question = data["question"]
        answer = generator(question)

        # setting counter for conversation id
        count = db.get("count")
        if count is None:
            db.set("count", 0)
        
        # conversation
        conversation = {
            "question": question,
            "answer": answer[0]["generated_text"],
            "timestamp": time.now().timestamp(),
            "id": db.incr("count")
        }
        print(conversation)
        # store conversation in redis db
        db.set(conversation["id"], json.dumps(conversation))
        return answer, 200
        
@app.route("/conversations", methods=["GET", "DELETE"])
def conversation():
    """
    Handles conversation queries
    -------
    - requires conversation id for conversation deletion
    - returns inference text response or boolean if conversation is deleted
    """
    if request.method == "GET":
        # check if all conversations are requested
        if request.args.get("all", False):
            # Retrieve all conversations from redis db
            conversations_data = [json.loads(db.get(conv_id)) for conv_id in db.scan_iter() if conv_id != "count"]
            return jsonify({"conversations": conversations_data}), 200
            
        # retrieves a single converation
        id = request.args.get("id", None)
        if id is None:
            return jsonify({"error": "id is required"}), 400

        # retrieve conversation from redis db
        conversation = json.loads(db.get(id))
        if conversation:
            return jsonify({"conversation": conversation}), 200
        else:
            return jsonify({"error": "Conversation not found"}), 404

    elif request.method == "DELETE":
        if request.args.get("all", False):
            # delete all conversations from redis db
            deleted = db.flushdb()
            return jsonify({"success": deleted}), 200
        
        id = request.args.get("id", None)
        if id is None:
            return jsonify({"error": "id is required"}), 400
        # delete conversation from db
        deleted = db.delete(id)
        return jsonify({"success": deleted}), 200
    
# make a request to redis and delete db
@app.route("/info", methods=["GET"])
def info():
    # return model meta data in a dynamic way (maybe just return model card)
    # this includes # of trainable parameters + more
    return jsonify({"model": model.config}), 200 #???????????

@app.route("/", methods=["GET"])
def home():
    return f"""Welcome to Bevo-Bud GPT Server! For help, visit the repo here: \nhttps://github.com/Kelach/Bevo-Bud-The-GPT\n""", 200
# return info about model

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
    