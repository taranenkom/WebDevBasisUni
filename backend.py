from flask import Flask, jsonify, request, send_from_directory, make_response
from werkzeug.utils import secure_filename
import os
import psycopg2
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = 'img'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


# PostgreSQL configuration
db_config = {
    'dbname': 'gallery',
    'user': 'mark',
    'password': PASSWORD,
    'host': '127.0.0.1',
    'port': '5432'
}

def connect_to_db():
    conn = psycopg2.connect(**db_config)
    return conn

@app.after_request
def add_cors_headers(response):
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS'
    return response

@app.route('/images', methods=['OPTIONS'])
def handle_options():
    return '', 200, {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
    }
    
@app.route('/upload', methods=['POST'])
def upload_image():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'})

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'})

    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(file_path)

        # Extract additional information sent in the request
        description = request.form.get('description', '')  # Assuming description is sent in the form data

        conn = connect_to_db()
        cursor = conn.cursor()

        try:
            # Insert image information into the database
            cursor.execute("INSERT INTO images (filename, description) VALUES (%s, %s);", (filename, description))
            conn.commit()
            cursor.close()
            conn.close()
            return jsonify({'message': 'File uploaded successfully'})
        except Exception as e:
            # Handle database errors
            return jsonify({'error': f'Database error: {str(e)}'})

    return jsonify({'error': 'Invalid file format or something went wrong'})

@app.route('/img/<filename>')
def uploaded_image(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

@app.route('/images', methods=['GET'])
def get_images():
    conn = connect_to_db()
    cursor = conn.cursor()
    try:
        cursor.execute('SELECT id, filename, description, created_at FROM images;')
        images = [{'id': row[0], 'filename': row[1], 'description': row[2], 'created_at': row[3]} for row in cursor.fetchall()]
        cursor.close()
        conn.close()
        return jsonify(images)
    except Exception as e:
        # Handle database errors
        return jsonify({'error': f'Database error: {str(e)}'})

if __name__ == '__main__':
    app.run(debug=True, ssl_context=('ssl/private/gallery.crt', 'ssl/private/gallery.key'))
    
