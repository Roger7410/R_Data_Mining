#size9
means9<-rep(NA,10000)
for (i in 1:10000){
  samp9<-rexp(9,rate=.1)  
  means9[i]<-mean(samp9)
}
#2
mean(means9)
sd(means9)
pnorm(7,9.973941,3.331934)
#2a
mean(rexp(10000,rate=.1))
sd(rexp(10000,rate=.1))
pnorm(7,10,3.333333)

#size64
means64<-rep(NA,10000)
for (i in 1:10000){
  samp64<-rexp(64,rate=.1)  
  means64[i]<-mean(samp64)
}
#2
mean(means64)
sd(means64)
pnorm(7,10.00652,1.255525)
#2a
pnorm(7,10,10/8)

par(mfrow=c(2,2))
hist(rexp(10000,rate=.1),breaks=50,xlim=c(0,8))
hist(means9,breaks=50,xlim=c(0,8))
