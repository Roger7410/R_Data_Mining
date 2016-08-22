#hw2-7
#lets just use the normal distribution in the last question
#N(50,9)  mean=50, sd=9, var=81
#we will try to get sample variance in different sample size 10,100,1000,10000
for(n in c(10,100,1000,10000)){
 samp<-rnorm(n,50,9)
 s_samp<-sqrt(sum((samp-mean(samp))^2)/(n-1))#sqrt((Xi-x)^2/n-1)
 print(s_samp^2)
}
#the results of variances are 
#10,    100,    1000,     10000
#100.12 83.87   82.22     80.78

#then we try it with exponent distribution
for(n in c(10,100,1000,10000)){
  samp<-rexp(n,rate=.1)
  s_samp<-sqrt(sum((samp-mean(samp))^2)/(n-1))#sqrt((Xi-x)^2/n-1)
  print(s_samp^2)
}
#the variance should be around 100
#the results are
#10,    100,    1000,     10000
#95.99  90.05   112.40    101.87

#the results show that in both shapes of distributions.
#with the size become larger,
#the variance of sample is more close to the variance of population
