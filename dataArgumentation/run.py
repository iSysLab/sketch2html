import generator
import imageMerge

generator = generator.Generator()
generator.imageGenerator('img/t.png',"warehouse/preview", 30)

imgMerge = imageMerge.ImageMerge()
imgMerge.merge("./warehouse/preview/","./warehouse/","result.png")