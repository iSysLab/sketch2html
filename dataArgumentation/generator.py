import numpy as np

class Generator:
    def __init__(self):
        pass
    def imageGenerator(self,dir,saveDir,crateImgNum):
        # 랜덤시드 고정시키기
        np.random.seed(5)

        from keras.preprocessing.image import ImageDataGenerator, array_to_img, img_to_array, load_img

        # 데이터셋 불러오기
        data_aug_gen = ImageDataGenerator(rescale=1. / 255,
                                          rotation_range=5,
                                          width_shift_range=0.1,
                                          height_shift_range=0.1,
                                          shear_range=0.5,
                                          zoom_range=[0.8, 2.0],
                                          horizontal_flip=False,  # 좌우 뒤집기
                                          vertical_flip=True,  # 상하 뒤집기
                                          fill_mode='nearest')

        img = load_img(dir)
        x = img_to_array(img)
        x = x.reshape((1,) + x.shape)
        i = 0
        # 이 for는 무한으로 반복되기 때문에 우리가 원하는 반복횟수를 지정하여, 지정된 반복횟수가 되면 빠져나오도록 해야합니다.
        for batch in data_aug_gen.flow(x, batch_size=1, save_to_dir=saveDir, save_prefix='tri',
                                       save_format='png'):
            i += 1
            if i > crateImgNum:
                break


if __name__=='__main__':
    generator= Generator()
    generator.imageGenerator('img/c5.PNG',"warehouse/preview",30)