# Bevo-Bud-The-GPT
Current and prospective students at UT Austin often struggle to find specific information efficiently through traditional university resources, such as the website or official channels. Bevo Bud The GPT aims to easily solve this issue by empowering students with the information they need seamlessly.

**Bevo Bud The GPT** is a full-stack web application where users can ask UT-related questions and get answers from the AI chatbot. Bevo Bud, the AI chatbot, was fined-tuned on archived reddit posts from the the r/UTAustin subreddit (see the [model-src](./model-src/) folder to learn more its development).

### Demo
![Demo](https://github.com/Kelach/Bevo-Bud-The-GPT/blob/main/Demo.gif)

## Technologies Used
- Frontend
    - React + Typescript (Mantine UI)
    - Node.js
- Backend
    - Python
    - Flask
    - HuggingFace
- Database
    - Redis
- Services
    - Docker
    - Docker-Compose

## Installation
You can easily start this application on your local machine by following the steps below:
- `Note:` You will need to have the latest version of Docker installed and at 8GB of storage to run this project locally.

1. To run this application, first clone the repository
    
    ```bash
    git clone
    ```

2. Next, change into the directory of this repository

    ```bash
    cd Bevo-Bud-The-GPT
    ```
3. Run the following docker-compose command to start the application!
    - `Note:` This step may take a while

    ```bash
    docker-compose up
    ```
    - 'Note:' Prepend `-d --build` at the end of this command if you want to also build the image
4. And that's it! Now you can access the application by visiting `http://localhost:3000` in your browser.

     - `Additional Notes`:
        - If you would like to stop the application, you can run the following command:
            ```bash
            docker-compose down
            ```
        - Each stack of the application is running in a separate container. If you would like to stop a specific container, you can change into the directory of the container and run `docker-compose up` within that directory. This is because both `client` and `server` folders have their own `docker-compose` files.

        - If you would like to see the logs of the application, you can run the following command:
            ```bash
            docker-compose logs -f
            ```
        - You only need to run the `docker-compose up ...` command with the `--build` flag **once** as the image will. After that, you can re-run `docker-compose up` without the `--build` flag to start the application.

## Usage:
Requests supported to the inference server:
|   | Route | Method | Returns |
| - | ----- | ------ | ------- |
| 1 | `/`   | GET | Info regarding the model |
| 2 | `/info` | GET | Metadata regarding the model |
| 3 | `/question` | POST | Inference response to message query |
| 4 | `/conversations` | GET, DELETE | Stored conversation queries from Redis database |
