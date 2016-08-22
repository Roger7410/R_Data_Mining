ptm<-proc.time()
mat<-matrix(rnorm(200000,50,7),10000,20)
rms<-rowMeans(mat)
par(mfrow=c(2,1))
hist(rnorm(10000,50,7),breaks=50,xlim=c(30,70),col="orange")
hist(rms,breaks=50,xlim=c(30,70),col="blue")
proc.time()-ptm