# (a)
library(MASS)
?Boston
dim(Boston)
head(Boston)

pairs(Boston)

par(mfrow=c(1,3))
Boston$ptratio
hist(Boston$crim[Boston$crim>1], breaks=25)
hist(Boston$tax, breaks=25)
hist(Boston$ptratio, breaks=25)

dim(subset(Boston, chas == 1))
sum(Boston$chas == 1)
median(Boston$ptratio)
median(Boston$medv)


t(subset(Boston, medv == min(Boston$medv)))
subset(Boston, medv == min(Boston$medv))

dim(subset(Boston, rm > 7))
dim(subset(Boston, rm > 8))
summary(subset(Boston, rm > 8))
summary(Boston)

dim(subset(Boston, rm > 7))
dim(subset(Boston, rm > 8))
summary(subset(Boston, rm > 8))
summary(Boston)