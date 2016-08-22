#hw2-2,2a
means9<-rep(NA,10000)
for (i in 1:10000){
  samp9<-rexp(9,rate=.1)  
  means9[i]<-mean(samp9)
}
mean(means9)#10.03646
sd(means9)  #3.355983
pnorm(7,10.03646,3.355983)#0.1827883
pnorm(7,10,10/3)#0.1840601

#hw2-3
means64<-rep(NA,10000)
for (i in 1:10000){
  samp64<-rexp(64,rate=.1)  
  means64[i]<-mean(samp64)
}
mean(means64)#10.00554
sd(means64)  #1.258088
pnorm(7,10.00554,1.258088)#0.00844774
pnorm(7,10,10/8)#0.008197536
