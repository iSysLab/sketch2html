import generator
import imageMerge
import glob
import time
from PIL import Image

target_dir="./img/" #지정할 디렉토리 경로
files = glob.glob(target_dir + "*.*")
generator = generator.Generator()

for i,file in enumerate(files):
    imgMerge = imageMerge.ImageMerge()
    print ("file: ",file)
    generator.imageGenerator(file,"warehouse/preview", 50)# 파일명, 결과물 출력경로 , 부풀리기할 객체 갯수
    imgMerge.merge("./warehouse/preview/","./warehouse/","result"+str(i)+".png")# 객체들 경로, 결과물 출력경로, 결과물 명

