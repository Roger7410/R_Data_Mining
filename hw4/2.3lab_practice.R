x<- c(1,2)
ls()
rm(x)

x=matrix(data=c(1,2,3,4), nrow=2, ncol=2)
x
x=rnorm(50)
y=x+rnorm(50,mean=50,sd=.1)
z<-rnorm(50,mean=50,sd=.1)
y
z<-z+x
z
cor(x,y)
a<-rnorm(50,5,1)
b<-a+rnorm(50,10,1)
cor(a,b)
set.seed(1303)
rnorm(50)
x=rnorm(100)
y=rnorm(100)
plot(x,y)
plot(x,y,xlab="this is the x-axis",ylab="this is the y-axis",
       main="Plot of X vs Y")
pdf("figure.pdf")
plot(x,y,col="green")
dev.off()
x=seq(-pi,pi,length=50)
x
y=x
f=outer(x,y,function (x,y)cos(y)/(1+x^2))
contour (x,y,f)
contour(x,y,f,nlevels=45,add=T)
fa=(f-t(f))/2
contour(x,y,fa,nlevels=15)
image(x,y,fa)
persp(x,y,fa)
persp(x,y,fa,theta=30)
persp(x,y,fa,theta=30,phi=20) 
persp(x,y,fa,theta=30,phi=70) 
persp(x,y,fa,theta=30,phi=40)
A=matrix(1:16,4,4)
A
A[2,3]
A[c(1,3),c(2,4)]
A[1:3,2:4]
A[1:2,]
A[,1:2]
Auto=read.table("Auto.data",header=T,na.strings="?")
Auto=read.csv("Auto.csv",header=T,na.strings ="?")
plot(cylinders , mpg)
