#hw2-5a
range<-seq(-4,4,.01)
layout(matrix(1:6,ncol=3))
for(i in c(1,2,3,5,20,50)){
  plot(range,dnorm(range),lty=1,col="orange")   #normal d
  lines(range,dt(range,df=i),lty=2,col="blue")  #t
  mtext(paste("df=",i),cex=1.2)                 #write text,cex-large the words
}
plot(dnorm(range))

#5b
pnorm(-1)          #0.1586553
qnorm(0.025,0,1)   #-1.959964
pnorm(1.959964)
#df = 5, 10, 100
pt(-1,5)           #0.1816087
qt(0.025,5)        #-2.570582
pt(-1,10)          #0.1704466
qt(0.025,10)       #-2.228139
pt(-1,100)         #0.1598621
qt(0.025,100)      #-1.983972

#5c
samp<-rnorm(10,50,9)
#the mean will 95% in the interval
t.test(samp)$conf.int     #39.48664-55.44897

#5d
mean(samp)                #47.4678
47.47-1.96*9/sqrt(10)        #41.89
47.47+1.96*9/sqrt(10)        #50.29
#do100
samp100<-rnorm(100,50,9)  
t.test(samp100)$conf.int  #47.73866-51.00789
mean(samp100)             #49.37328
49.37-1.96*9/sqrt(100)        #47.606
49.37+1.96*9/sqrt(100)        #51.134

#5e
t.test(samp,conf.level = .99)$conf.int
t.test(samp100,conf.level = .99)$conf.int
