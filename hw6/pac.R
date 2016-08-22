#PCA
install.packages("pls")
library(pls)
library(ISLR)
pr.out<-prcomp(USArrests,scale=T)
pr.out$rotation=-pr.out$rotation
biplot(pr.out)
