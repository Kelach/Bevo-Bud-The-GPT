
from flask import Flask, request, jsonify
from peft import PeftModel, PeftConfig
from transformers import AutoModelForCausalLM, AutoTokenizer, pipeline

config = PeftConfig.from_pretrained("Kelechie/Bevo-Budv1.0")
model = AutoModelForCausalLM.from_pretrained("distilbert/distilgpt2")
model = PeftModel.from_pretrained(model, "Kelechie/Bevo-Budv1.0")

# model = "Kelechie/Bevo-BudGPT"
# model_checkpoint = "distilgpt2"
# tokenizer = AutoTokenizer.from_pretrained(model_checkpoint, use_fast=True)
generator = pipeline(model="Kelechie/Bevo-Budv1.0")

app = Flask(__name__)

# load model and make a request using pipline
@app.route("/question", methods=["POST", "DELETE"])
def question():
    """
    Handles message queries
    -------
    - requires question id for question deletion
    - returns inference text response or boolean if conversation is deleted
    """
    return generator("What are some easy electives to take?")
    
# make a request to redis and delete question
@app.route("/db", methods=["DELETE"])
def clear_db():
    # clears database
    pass

# make a request to redis and delete db
@app.route("/info", methods=["GET"])
def info():
    # return model meta data in a dynamic way (maybe just return model card)
    # this includes # of trainable parameters + more
    pass

@app.route("/", methods=["GET"])
def home():
    return f"""Welcome to Bevo-Bud GPT Server!""", 200
# return info about model

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
    