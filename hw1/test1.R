p <- c(6,5,4,3,2,1)
pp <- c(2,3)
p[pp]
p = p[-pp]
p[p>3]
p[p>3] <- 7
p[p>3] <- c(8,9,10)
p[]
seq(1,10,3)
seq(1,100,3)
seq(1,99,3)
1:40
seq(1,100,length=4)
seq(1,99,length=4)
as.integer(3.2)
as.character(3.2)
as.array(3.2)
1&2
0&1
1&&2
0|1
0||1
a <- list(name="Joe",4,foo=c(1,2,3))
a$name
a$foo
a$``
a[[2]]
a$aaa = TRUE
a[[6]] = "like"
a[[9]] -> oo = "b"
m <- array(c(1,2,3,4,5,6), dim=c(2,3), by.row = TRUE)  
m by.row=TRUE
mat9 <- matrix(c(rep(1, 3), rep(2, 3)), 2, byrow = T)
f <- function(a, b)
{
  return (a+b)
}
f(2,3)
x <- 1:3
typeof(x)
mode(x)
