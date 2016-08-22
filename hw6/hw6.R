library(ISLR)
attach(Auto)
head(Auto)
#a
length(mpg)
mpg01<-rep(0,392)
mpg01[mpg>median(mpg)]<-1
NewAuto<-data.frame(Auto,mpg01)
#b
pairs(NewAuto)
cor(NewAuto[,-9])
#c
trainSet = (year%%2 == 0)
trainSet#392
sum(trainSet == T)#210
sum(trainSet == F)#182
testSet = !trainSet
testSet#392
sum(testSet == T)#182
sum(testSet == F)#210
NewAuto.trainSet = NewAuto[trainSet, ]
dim(NewAuto.trainSet)
head(NewAuto.trainSet)
head(NewAuto.trainSet)
NewAuto.testSet = NewAuto[testSet, ]
mpg01.testSet = mpg01[testSet]
mpg01.testSet
mpg01
#d
library(MASS)
lda.fit = lda(mpg01 ~ cylinders + weight + displacement + horsepower, data = NewAuto, 
              subset = trainSet)
lda.pred = predict(lda.fit, NewAuto.testSet)
mean(lda.pred$class != mpg01.testSet)
#e
qda.fit = qda(mpg01 ~ cylinders + weight + displacement + horsepower, data = NewAuto, 
              subset = trainSet)
qda.pred = predict(qda.fit, NewAuto.testSet)
mean(qda.pred$class != mpg01.testSet)
#f
glm.fit = glm(mpg01 ~ cylinders + weight + displacement + horsepower, data = NewAuto, 
              family = binomial, subset = trainSet)
glm.probs = predict(glm.fit, NewAuto.testSet, type="response")
length(glm.probs)
glm.pred = rep(0, 182)
glm.pred[glm.probs > 0.5] = 1
mean(glm.pred != mpg01.testSet)
#g
library(class)
trainSet.X = cbind(cylinders, weight, displacement, horsepower)[trainSet, ]
testSet.X = cbind(cylinders, weight, displacement, horsepower)[testSet, ]
trainSet.mpg01 = mpg01[trainSet]
knn.pred = knn(trainSet.X, testSet.X, trainSet.mpg01, k = 1)
mean(knn.pred != mpg01.testSet)
knn.pred = knn(trainSet.X, testSet.X, trainSet.mpg01, k = 2)
mean(knn.pred != mpg01.testSet)
knn.pred = knn(trainSet.X, testSet.X, trainSet.mpg01, k = 5)
mean(knn.pred != mpg01.testSet)
knn.pred = knn(trainSet.X, testSet.X, trainSet.mpg01, k = 10)
mean(knn.pred != mpg01.testSet)
knn.pred = knn(trainSet.X, testSet.X, trainSet.mpg01, k = 100)
mean(knn.pred != mpg01.testSet)
knn.pred = knn(trainSet.X, testSet.X, trainSet.mpg01, k = 110)
mean(knn.pred != mpg01.testSet)

