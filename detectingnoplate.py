import cv2
import time
# Importing the Opencv Library
import numpy as np
import requests, sys, json, urllib
import os
#import Image 
server = 'http://127.0.0.1:3000'
headers = {'Content-Type': 'application/json'}
payload = {'location': 'BANG'}

# Importing NumPy,which is the fundamental package for scientific computing with Python

def stopwatch(seconds):
    start = time.time()
    time.clock()    
    elapsed = 0
    while elapsed < seconds:
        elapsed = time.time() - start
        #print "loop cycle time: %f, seconds count: %02d" % (time.clock() , elapsed) 
        time.sleep(1)  



# Reading Image
img = cv2.imread("test1.jpg")
#cv2.namedWindow("Original Image",cv2.WINDOW_NORMAL)
# Creating a Named window to display image
#cv2.imshow("Original Image",img)
#cv2.waitKey(0)
#cv2.destroyAllWindows()
print("displayed")
# Display image


#stopwatch(15)
# RGB to Gray scale conversion
img_gray = cv2.cvtColor(img,cv2.COLOR_RGB2GRAY)
#cv2.namedWindow("Gray Converted Image",cv2.WINDOW_NORMAL)
# Creating a Named window to display image
#cv2.imshow("Gray Converted Image",img_gray)
# Display Image
#cv2.waitKey(0)

#stopwatch(15)
# Noise removal with iterative bilateral filter(removes noise while preserving edges)
noise_removal = cv2.bilateralFilter(img_gray,9,75,75)
#cv2.namedWindow("Noise Removed Image",cv2.WINDOW_NORMAL)
# Creating a Named window to display image
#cv2.imshow("Noise Removed Image",noise_removal)
#cv2.waitKey(0)
# Display Image

#stopwatch(15)
# Histogram equalisation for better results
equal_histogram = cv2.equalizeHist(noise_removal)
#cv2.namedWindow("After Histogram equalisation",cv2.WINDOW_NORMAL)
# Creating a Named window to display image
#cv2.imshow("After Histogram equalisation",equal_histogram)
# Display Image
#cv2.waitKey(0)
# Morphological opening with a rectangular structure element
kernel = cv2.getStructuringElement(cv2.MORPH_RECT,(5,5))
morph_image = cv2.morphologyEx(equal_histogram,cv2.MORPH_OPEN,kernel,iterations=15)
#cv2.namedWindow("Morphological opening",cv2.WINDOW_NORMAL)
# Creating a Named window to display image
#cv2.imshow("Morphological opening",morph_image)
# Display Image
#cv2.waitKey(0)

# Image subtraction(Subtracting the Morphed image from the histogram equalised Image)
sub_morp_image = cv2.subtract(equal_histogram,morph_image)
#cv2.namedWindow("Subtraction image", cv2.WINDOW_NORMAL)
# Creating a Named window to display image
#cv2.imshow("Subtraction image", sub_morp_image)
# Display Image
#cv2.waitKey(0)

# Thresholding the image
ret,thresh_image = cv2.threshold(sub_morp_image,0,255,cv2.THRESH_OTSU)
#cv2.namedWindow("Image after Thresholding",cv2.WINDOW_NORMAL)
# Creating a Named window to display image
#cv2.imshow("Image after Thresholding",thresh_image)
# Display Image
#cv2.waitKey(0)
# Applying Canny Edge detection
canny_image = cv2.Canny(thresh_image,250,255)
#cv2.namedWindow("Image after applying Canny",cv2.WINDOW_NORMAL)
# Creating a Named window to display image
#cv2.imshow("Image after applying Canny",canny_image)
#cv2.waitKey(0)
# Display Image
canny_image = cv2.convertScaleAbs(canny_image)

# dilation to strengthen the edges
kernel = np.ones((3,3), np.uint8)
# Creating the kernel for dilation
dilated_image = cv2.dilate(canny_image,kernel,iterations=1)
#cv2.namedWindow("Dilation", cv2.WINDOW_NORMAL)
# Creating a Named window to display image
#cv2.imshow("Dilation", dilated_image)
#cv2.waitKey(0)
# Displaying Image

# Finding Contours in the image based on edges
contours, hierarchy, _ = cv2.findContours(dilated_image, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)
contours= sorted(contours, key = cv2.contourArea, reverse = True)[:10]
# Sort the contours based on area ,so that the number plate will be in top 10 contours
screenCnt = None
# loop over our contours
for c in contours:
 # approximate the contour
 peri = cv2.arcLength(c, True)
 approx = cv2.approxPolyDP(c, 0.06 * peri, True)  # Approximating with 6% error
 # if our approximated contour has four points, then
 # we can assume that we have found our screen
 if len(approx) == 4:  # Select the contour with 4 corners
  screenCnt = approx
  break
final = cv2.drawContours(img, [screenCnt], -1, (0, 255, 0), 3)
# Drawing the selected contour on the original image
#cv2.namedWindow("Image with Selected Contour",cv2.WINDOW_NORMAL)
# Creating a Named window to display image
#cv2.imshow("Image with Selected Contour",final)
#cv2.waitKey(0)

# Masking the part other than the number plate
mask = np.zeros(img_gray.shape,np.uint8)
new_image = cv2.drawContours(mask,[screenCnt],0,255,-1,)
new_image = cv2.bitwise_and(img,img,mask=mask)
#cv2.namedWindow("Final_image",cv2.WINDOW_NORMAL)
#cv2.imshow("Final_image",new_image)
cv2.imwrite("final.jpg",new_image)
#cv2.waitKey(0)
# Histogram equal for enhancing the number plate for further processing
y,cr,cb = cv2.split(cv2.cvtColor(new_image,cv2.COLOR_BGR2YCR_CB))
# Converting the image to YCrCb model and splitting the 3 channels
y = cv2.equalizeHist(y)
# Applying histogram equalisation
#final_image = cv2.cvtColor(cv2.merge([y,cr,cb]),cv2.COLOR_YCrCb2RGB)
# Merging the 3 channels
#k = image_to_string(Image.open('final.jpg'), lang='eng')
#print k
cv2.namedWindow("Enhanced Number Plate",cv2.WINDOW_NORMAL)
# Creating a Named window to display image
cv2.imshow("Enhanced Number Plate",new_image)
#cv2.imwrite(new_image)
cv2.waitKey(0)
# Display image

print("post api call")
r = requests.post(server + '/ocr', data = json.dumps(payload), headers = headers)
if r.status_code != 200:
    print("Failed")
    sys.exit(0)
else:
    print("success")
# Wait for a keystroke from the user

