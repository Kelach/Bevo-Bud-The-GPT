FROM python:3.11
RUN pip install Flask==3.0
RUN pip install transformers==4.40.0
RUN pip install peft==0.7.0
RUN pip install flask-cors==4.0.0
RUN pip install redis==5.0.4

COPY server.py /server.py
CMD ["python3", "server.py"]