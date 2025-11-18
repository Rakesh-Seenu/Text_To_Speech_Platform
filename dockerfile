# Use an official Python runtime as a parent image
FROM python:3.11-slim

# Set the working directory in the container
WORKDIR /usr/src/app

# 1. Install Dependencies
# Copy the requirements file and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 2. Copy Application Files
# Copy the Python backend and all static frontend files
COPY app.py .
COPY index.html .
COPY script.js .
COPY style.css .

# 3. Define Environment
# Flask runs on port 5000 by default. Expose it.
EXPOSE 5000

# Set the host to 0.0.0.0 so it is accessible outside the container
ENV FLASK_RUN_HOST=0.0.0.0

# 4. Run the Application
# Command to execute when the container starts
CMD ["python", "app.py"]