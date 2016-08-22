#Program that simulates an empirical standard normal 
#distribution, and a t distribution with 9 degrees of freedom
#using smaples of size 10.

smean<-rep(NA,10000)
svar<-rep(NA,10000)
  for (i in 1:10000){
        samp<-rnorm(10,mean=50,sd=9)
        smean[i]<-mean(samp)
        svar[i]<-var(samp)
    }
 results<-data.frame(mean=smean,var=svar)
 t<-(results$mean-50)/(sqrt(results$var)/sqrt(10))
 z<-(results$mean-50)/(9/sqrt(10))
 results<-cbind(results,z)
 results<-cbind(results,t)
 par(mfrow=c(2,1))
 hist(results$z,breaks=50,xlim=c(-3,3))
 hist(results$t,breaks=50,xlim=c(-3,3))