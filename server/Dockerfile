FROM python:3.11
RUN pip install Flask==3.0
RUN pip install transformers==4.40.0
RUN pip install peft==0.7.0

COPY server.py /server.py

CMD ["python3", "server.py"]