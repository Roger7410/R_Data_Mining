#a
set.seed(1)
y=rnorm(100)
x=rnorm(100)
y=x-2*x^2+rnorm(100)
#b
plot(x,y)
#c
library(boot)
xy = data.frame(x, y)
set.seed(1)
glm.fit = glm(y ~ x)
cv.glm(xy, glm.fit)$delta

glm.fit = glm(y ~ poly(x,2))
cv.glm(xy, glm.fit)$delta

glm.fit = glm(y ~ poly(x,3))
cv.glm(xy, glm.fit)$delta

glm.fit = glm(y ~ poly(x,4))
cv.glm(xy, glm.fit)$delta

#d
set.seed(2)
glm.fit = glm(y ~ x)
cv.glm(xy, glm.fit)$delta

glm.fit = glm(y ~ poly(x,2))
cv.glm(xy, glm.fit)$delta

glm.fit = glm(y ~ poly(x,3))
cv.glm(xy, glm.fit)$delta

glm.fit = glm(y ~ poly(x,4))
cv.glm(xy, glm.fit)$delta

#f
summary(glm.fit)
