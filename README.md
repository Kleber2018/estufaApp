# estufaApp
App em Ionic para monitorar os dados de Temperatura e umidade da estufa


CONFIGURANDO AS VARIÁVEIS DE AMBIENTE
http://www.tiagoporto.com/blog/tutorial-de-configuracao-do-ambiente-ionic-android-no-windows/


remover a plataforma
ionic cordova platform rm android
ionic cordova platform add android

###

executar no celular

ionic cordova run android -l


## Generate Angular

Generate módulo com rota:

```ionic g module alert-config --routing=true```

Generate componente em nova pasta selecionando o modulo:

```ionic g component alert-config/alert-config --module=measurements```

Generate service

```ionic g s alert-config/alert-config```



## TESTE
Um teste rápido será criarmos um projeto IONIC, adicionarmos uma plataforma e fazer o build gerando o instalável no dispositivo. http://www.tiagoporto.com/blog/tutorial-de-configuracao-do-ambiente-ionic-android-no-windows/

$ionic cordova platform add android

$ionic cordova build

$ionic cordova platform rm android  (caso já exista plataforma)


# CORDOVA NATIVE
### cor do status bar
https://pt.stackoverflow.com/questions/319833/ionic-mudar-cor-da-barra-superior-do-aplicativo
https://ionicframework.com/docs/native/status-bar

Para Geolocation
npm install @ionic-native/geolocation
