#1a
results<-vector(mode="integer",length=100000)
for(i in 1:100000){
  heads<-0
  x<-sample(10,50,replace = TRUE) # get 50 samples between 1-10
  for(j in 1:50){
    if(x[j]<=6){ #if the samples <=6, record as heads
      heads<-heads+1
    }
  }
  results[i]<-results[i]+heads
}
hist(results,breaks=50)
mean(results)
sd(results)

#1b   35heads
dnorm(35,29.99942,3.46195)
dnorm(35,30.01528,3.465176)#another test
#for calculate theoretical probability of 35 heads
sum<-1
a<-50
b<-15
for(i in 1:15){
  sum<-sum*a/b
  a<-a-1
  b<-b-1
}
sum<-sum*0.6^35*0.4^15
#35heads fewer
pnorm(35,29.99942,3.46195)
pnorm(35,30.01528,3.465176)#another test
#for calculate theoretical probability of 35 heads or fewer
sum2<-0
for(i in 1:35){
  tmp<-1
  a<-50
  b<-1
  for(j in 1:i){
    tmp<-tmp*a/b
    a<-a-1
    b<-b+1
  }
  tmp<-tmp*0.6^i*0.4^(50-i)
  sum2<-sum2+tmp
}

#1c
results<-vector(mode="integer",length=100000)
for(i in 1:100000){
  heads<-0
  x<-sample(10,50,replace = TRUE) # get 50 samples between 1-10
  for(j in 1:50){
    if(x[j]<=8){ #if the samples <=8, record as heads
      heads<-heads+1
    }
  }
  results[i]<-results[i]+heads
}
hist(results,breaks=50)
mean(results)
sd(results)
