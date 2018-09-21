def run(imgAndXmlName,objectType):
    import generator
    import imageMerge
    import glob
    import makeXML
    from PIL import Image
    target_dir="./img/" #지정할 디렉토리 경로
    files = glob.glob(target_dir + "*.*")
    generator = generator.Generator()
    makexml=makeXML.makeXML()
    for i,file in enumerate(files):
        imgMerge = imageMerge.ImageMerge()
        generator.imageGenerator(file,"warehouse/preview", 50)# 파일명, 결과물 출력경로 , 부풀리기할 객체 갯수
        fileName, positionList=imgMerge.merge("./warehouse/preview/","./warehouse/resultImg/",imgAndXmlName+str(i))# 객체들 경로, 결과물 출력경로, 결과물 명
        makexml.runMakeXML("./warehouse/xml/", objectType, fileName, positionList)
        print("file: ", file)

if __name__=='__main__':
    objectList={'1':'button',
                '2': 'editText',
                '3': 'radioButtonV',#수직방향
                '4': 'radioButtonH',#수평방향
                '5': 'checkBoxV',
                '6': 'checkBoxH',}
    run( imgAndXmlName="b", objectType=objectList['1'])