result<-c(0,0,0,0,0)  #p of 0,1,2,3,4 times
n<-10000  #times
for(i in 1:n){
  count <- 0
  tmp<-sample(4)
  for(j in 1:4){
    if(tmp[j]==j){
      count<-count+1
    }
  }
  result[count+1]<-result[count+1]+1
}
for(k in 1:5){
  result[k]<-result[k]/10000
}
print(result)
