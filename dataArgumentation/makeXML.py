class makeXML:
    def __init__(self):
        self.text=""
        self.f = []

    def startXML(self,dir, XML):#input file Name > html, css
         self.text = ""
         self.f = []
         self.f.append(open(dir+XML+".xml", "w"))
         self.text = "<annotation>\n" \
                     "\t<folder>dataSet</folder>\n" \
                     "\t<filename>"+XML+".jpg</filename>\n" \
                     "\t<source>\n" \
                     "\t\t<database>Unknown</database>\n" \
                     "\t</source>\n" \
                     "\t<size>\n" \
                     "\t\t<width>800</width>\n" \
                     "\t\t<height>600</height>\n" \
                     "\t\t<depth>1</depth>\n" \
                     "\t</size>\n" \
                     "\t<segmented>0</segmented>\n"

    def putObjectXml(self, ObjectType,x1,y1,x2,y2):
        self.text += "\t<object>\n" \
                     "\t\t<name>"+ObjectType+"</name>\n" \
                     "\t\t<pose>Unspecified</pose>\n" \
                     "\t\t<truncated>0</truncated>\n" \
                     "\t\t<difficult>0</difficult>\n" \
                     "\t\t<bndbox>\n" \
                     "\t\t\t<xmin>"+str(x1)+"</xmin>\n" \
                     "\t\t\t<ymin>"+str(y1)+"</ymin>\n" \
                     "\t\t\t<xmax>"+str(x2)+"</xmax>\n" \
                     "\t\t\t<ymax>"+str(y2)+"</ymax>\n" \
                     "\t\t</bndbox>\n" \
                     "\t</object>\n"
    def endXML(self):
        self.text += "</annotation>"
        self.f[0].write(self.text)
        self.f[0].close()

    def runMakeXML(self,dir,ObjectType,fimeName,positionList):
        self.startXML(dir,fimeName)
        for item in positionList:
            self.putObjectXml(ObjectType, item[0], item[1], item[2], item[3])
        self.endXML()

if __name__=='__main__':
    fileName="boo"
    positionList=[[0, 0, 209, 116], [209, 0, 418, 116], [0, 116, 209, 232], [209, 116, 418, 232], [418, 116, 627, 232],
     [0, 232, 209, 348], [209, 232, 418, 348], [418, 232, 627, 348], [0, 348, 209, 464], [209, 348, 418, 464],
     [418, 348, 627, 464], [0, 464, 209, 580], [209, 464, 418, 580], [418, 464, 627, 580]]
    xml = makeXML()
    xml.runMakeXML("./warehouse/xml/","radioButton",fileName,positionList)