# Model Source Directory

This directory, `model-src`, is where the Bevo Bud model was fine-tuned. It contains several important files that contribute to the functionality and performance of the model. All of the work included here was done on a remote machine with a GPU, so the files are not intended to be run on a local machine.

## Files in this directory

1. `previewing.ipynb`: Used to preview the raw reddit data
2. `processing.ipynb`: Used to process and prepare the raw data for training
3. `finetuning.ipynb`: Fine-tuning operations done on the model

## Detailed Descriptions

### `previewing.ipynb`
Converts text files containing UT Austin submissions and comments into JSON format using a custom function called convert_txt_to_json. After the conversion process, the file loads the converted JSON files to preview the data, providing insights into the total number of submissions and comments. It then showcases a sample submission and comment in JSON format, offering a glimpse into the data structure and content. Additionally, the file conducts data analysis, identifying duplicate submission IDs and checking for missing comments or submissions. Furthermore, it calculates statistics such as the total number of comments with a specific prefix ('t3_'), comments with missing submissions, and submissions with mismatched comments. These operations collectively provide a comprehensive overview of the data, aiding in understanding its structure and identifying potential issues or discrepancies.

### `processing.ipynb`
Loads and processes data from JSON files containing UT Austin submissions and comments. It creates mappings for unique submission and comment IDs to filter and organize data effectively. The notebook structures data into a conversational format suitable for training the model, replacing "I" with "a student" in responses and filtering based on comment scores. It formats Reddit posts into a conversational structure with roles (system, user, assistant) for training the model. Finally, it saves the processed and formatted data into a JSON file for training the GPT-2 model.

### `finetuning.ipynb`
This file sets up and fine-tunes the `distilbert/distilgpt`  model using Hugging Face's Transformers library. It loads a processed dataset, prepares the tokenizer and model architecture, configures training parameters, and trains the model using low-rank adapters. Once trained, the model is tested and then uploaded onto to the Hugging Face model hub.
