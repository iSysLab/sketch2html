from flask import Flask, request, send_from_directory, redirect, url_for
from PIL import Image, ImageDraw
from io import BytesIO
import re
import base64

app = Flask(__name__)

@app.route('/')
def index():
    return app.send_static_file('sketch2html.html')

@app.route('/out')
def out():
    return app.send_static_file('out.html')

@app.route('/css/<path:path>')
def send_css(path):
    return send_from_directory('css', path)

@app.route('/images/<path:path>')
def send_images(path):
    return send_from_directory('images', path)

@app.route('/js/<path:path>')
def send_js(path):
    return send_from_directory('js', path)


@app.route('/send_img', methods=['POST'])
def send_img():
    image_b64 = request.values['imgBase64']
    image_data = re.sub('^data:image/.+;base64,', '', image_b64)  # to remove data:image/png;base64
    img = Image.open(BytesIO(base64.b64decode(image_data)))
    img.save('images/origin.jpg')
    # sketch to out.html
    return 'OK'

if __name__=='__main__':
    app.run(host='0.0.0.0')
