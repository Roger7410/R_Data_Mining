#stats lab2
#1
tb<-scan("tb_react.data")
qqnorm(tb)#linely
#hist(tb,breaks=20)
mean(tb)
s_tb<-sqrt(sum(tb^2)/(334-1))
t.test(tb,mu=0) #assume there are giving the same readings,
                #p-value = 1.11e-13, so reject(different readings)

#2
samp10<-rnorm(10,50,7)
t.test(samp10,mu=50)
t.test(samp10,mu=51)
t.test(samp10,mu=49)

#3
df<-data.frame(l_end=numeric(0),r_end=numeric(0),t_stat=numeric(0),p_value=numeric(0),result=logical(0))
#head(df)
#x<-data.frame(l_end=1,r_end=7,t_stat=1,p_value=0.2,result=T)
#df<-rbind(df,x)
#head(df)
for(i in 1:1000){
  samp10<-rnorm(10,50,7)
  result<-t.test(samp10,mu=50,conf.level = .95)
  #result
  t.stat<-result[1]$statistic
  p.val<-result[3]$p.value
  l.end<-result[4]$conf.int[1]
  r.end<-result[4]$conf.int[2]
  rult<-F
  if(p.val>0.05){
    rult<-T
  }
  x<-data.frame(l_end=l.end,r_end=r.end,t_stat=t.stat,p_value=p.val,result=rult)
  df<-rbind(df,x)
}
head(df)
sum(df$result==TRUE)

#3. again
veca<-rnorm(10000,11,3)
vecb<-rnorm(10000,3,4)
veca_b<-veca-vecb
hist(veca_b)
mean(veca_b)
sd(veca_b)

#4
vecaa<-rnorm(10000,10,3)
vecbb<-rnorm(10000,3,8)
vecca_b<-vecaa-vecbb
hist(vecca_b)
mean(vecca_b)
sd(vecca_b)
3*3+8*8
sqrt(73)

vecapb<-veca+vecb
hist(vecapb)
mean(vecapb)
sd(vecapb)

vecappb<-vecaa+vecbb
hist(vecappb)
mean(vecappb)
sd(vecappb)

#5
df<-read.csv("temperatures.csv")
men<-df$temp[df$gender=="Male"]
women<-df$temp[df$gender=="Female"]
t.test(men,women,mu=0)
#p-value= 0.02