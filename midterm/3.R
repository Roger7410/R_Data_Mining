river=read.csv("RiverData.csv",header=T,na.strings ="?")
river
river<-river[-1]
river<-river[-1]
plot(river, panel = panel.smooth)
cor(river)

fit <- lm(RiverNO3 ~. - RiverName - Country, data = river)
summary(fit)
fit <- lm(RiverNO3 ~ Runoff + Precipitation, data = river)
summary(fit)
fit <- lm(RiverNO3 ~ PopDensity, data = river)
summary(fit)
fit <- lm(RiverNO3 ~ PopDensity + NConcentration, data = river)
summary(fit)
fit <- lm(RiverNO3 ~ PopDensity * NConcentration, data = river)
summary(fit)
fit <- lm(RiverNO3 ~ PopDensity * Precipitation, data = river)
summary(fit)
fit <- lm(RiverNO3 ~ Precipitation * NConcentration, data = river)
summary(fit)
fit <- lm(RiverNO3 ~ log(PopDensity), data = river)
summary(fit)
fit <- lm(RiverNO3 ~ log(NConcentration), data = river)
summary(fit)
fit <- lm(RiverNO3 ~ I(PopDensity^2), data = river)
summary(fit)
fit <- lm(RiverNO3 ~ I(PopDensity^2)*NConcentration, data = river)
summary(fit)
fit <- lm(RiverNO3 ~ I(PopDensity^2)*I(NConcentration^2), data = river)
summary(fit)
fit <- lm(RiverNO3 ~ PopDensity*I(NConcentration^2), data = river)
summary(fit)
fit <- lm(RiverNO3 ~ sqrt(PopDensity), data = river)
summary(fit)



fit <- lm(RiverNO3 ~ PopDensity * NConcentration, data = river)
summary(fit)

fit <- lm(RiverNO3 ~ PopDensity + NConcentration, data = river)
summary(fit)

fit <- lm(RiverNO3 ~ Runoff + Precipitation, data = river)
summary(fit)
