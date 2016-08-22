result<-c(0,0)
x<-sample(10,50,replace = TRUE)
for(i in 1:50){
  if(x[i]<=6){
    result[1]<-result[1]+1
  }else{
    result[2]<-result[2]+1
  }
}
print(result[1])
print(result[2])
hist(x)

