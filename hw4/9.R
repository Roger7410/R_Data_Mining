Auto=read.csv("Auto.csv",header=T,na.strings ="?")
fix(Auto)
dim(Auto)
Auto=na.omit(Auto)
attach(Auto)
range(Auto$mpg)

sapply(Auto[, 1:8], range)
sapply(Auto[, 1:8], mean)
sapply(Auto[, 1:8], sd)

Auto2<-Auto[-(10:85),]
Auto2
head(Auto2,10)
dim(Auto2)

sapply(Auto2[, 1:8], range)
sapply(Auto2[, 1:8], mean)
sapply(Auto2[, 1:8], sd)

head(Auto)
pairs(Auto)
plot(Auto$mpg,Auto$cylinders)
plot(Auto$mpg, Auto$weight)

pairs(Auto)