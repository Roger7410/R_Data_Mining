df<-read.csv("temperatures.csv")
df
men<-df$temp[df$gender=="Male"]
women<-df$temp[df$gender=="Female"]
t.test(men,women,mu=0)
t.test(men-women,mu=0)


head(df)
hist(df$temp,breaks=50)
tapply(df$temp,df$gender,mean)
tapply(df$temp,df$gender,summary)
men<-df$temp[df$gender=="Male"]
women<-df$temp[df$gender=="Female"]
par(mfrow=c(2,1))
hist(men,breaks=30)
hist(women,breaks=30)

#boxplot(df$temp - df$gender)
t.test(men,conf.level=0.95)$conf.int
mean(men)  #x = 98.10
sd(men)    #s =.6987558
length(men)# n = 65(degrees of freedom = 64)

qqnorm(men)
t.test(men,mu=98.6)# mu is the hypothesis
#our sample data lines 5.7 standard dev below the hypothesisd mean
#p-value
t.test(men,mu=98.1)
#if p-value <0.05 alot,  reject Ho 
