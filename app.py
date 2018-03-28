from flask import Flask, request, send_from_directory, redirect, url_for
from PIL import Image, ImageDraw
from io import BytesIO
import re
import base64
import layoutDetection
from time import sleep

app = Flask(__name__)

@app.route('/')
def index():
    return app.send_static_file('sketch2html.html')

@app.route('/images/<path:path>')
def send_images(path):
    return send_from_directory('images', path)

@app.route('/gif/<path:path>')
def send_gif(path):
    return send_from_directory('gif', path)

@app.route('/gui/<path:path>')
def send_gui(path):
    return send_from_directory('gui', path)

@app.route('/html/<path:path>')
def send_html(path):
    return send_from_directory('html', path)

@app.route('/examples/<path:path>')
def send_examples(path):
    return send_from_directory('examples', path)

@app.route('/css/<path:path>')
def send_css(path):
    return send_from_directory('css', path)

@app.route('/js/<path:path>')
def send_js(path):
    return send_from_directory('js', path)

@app.route('/send_img', methods=['POST'])
def send_img():
    image_b64 = request.values['imgBase64']
    ts = request.values['timestamp']
    image_data = re.sub('^data:image/.+;base64,', '', image_b64)  # to remove data:image/png;base64
    img = Image.open(BytesIO(base64.b64decode(image_data)))
    html_filename = "sketch2html_result_" + ts
    img.save('images/origin.jpg')
    #--converting start--
    layoutDetection.main("images/origin.jpg", html_filename, html_filename)
    # sketch to out.html
    #--converting time end--
    return 'OK'

if __name__=='__main__':
    app.run(host='0.0.0.0')
