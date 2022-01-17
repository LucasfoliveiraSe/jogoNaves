function start() {
    
    $('#inicio').hide();
    $("#fundodoGame").append("<div id='jogador' class='anima1'></div>");
    $("#fundodoGame").append("<div id='inimigo1' class='anima2'></div>");
    $("#fundodoGame").append("<div id='inimigo2'></div>");
    $("#fundodoGame").append("<div id='amigo' class='anima3'></div>");
    $("#fundodoGame").append("<div id='placar'></div>");
    $("#fundodoGame").append("<div id='energia'></div>");
    
     
    //Principais variáveis do jogo
	
    var jogo = {}
    var tecla = {
        W: 87,
        S: 83,
        D: 68
    }

    var pontos = 0 ;
    var salvos = 0 ;
    var perdidos = 0 ;

    var velocidade = 5 ;
    var posicaoY = parseInt(Math.random() * 334 );
    var podeAtirar=true;
    var fimdejogo=false;
    var energiaAtual = 3 ;
	jogo.pressionou = [] ;

    var somDisparo=document.getElementById("somDisparo");
    var somExplosao=document.getElementById("somExplosao");
    var musica=document.getElementById("musica");
    var somGameover=document.getElementById("somGameover");
    var somPerdido=document.getElementById("somPerdido");
    var somResgate=document.getElementById("somResgate");

    musica.play()

    $(document).keydown(function(e){
        jogo.pressionou[e.which] = true;
    });
    $(document).keyup(function(e){
        jogo.pressionou[e.which] = false;
    });


    //Game Loop

    jogo.timer = setInterval(loop,30);
    
    function loop() {

        movefundo();
        moveJogador();
        moveInimigo1();
        moveInimigo2();
        moveAmigo();
        colisao();
        placar();
        energia();
        
        

    } // Fim da função loop()



    //Função que movimenta o fundo do jogo

    function reiniciaJogo() {
        somGameover.pause();
        $("#fim").remove();
        start();
        
}    

    function movefundo() {

        esquerda = parseInt($("#fundodoGame").css("background-position"));
        $("#fundodoGame").css("background-position",esquerda-2);

    } // fim da função movefundo()

    function moveJogador() {
        if (jogo.pressionou[tecla.W]) {
            var topo = parseInt($("#jogador").css("top"));
            if ( topo >= 9 ) {
               $("#jogador").css("top",topo-10);
            }
            
        }
        
        if (jogo.pressionou[tecla.S]) {
            var topo = parseInt($("#jogador").css("top"));
            if ( topo <= 434 ) {
                $("#jogador").css("top",topo+10);
            }
        }

        if (jogo.pressionou[tecla.D]) {
            disparo();
        }

    }

    function moveInimigo1() {
        let posicaoX = parseInt($("#inimigo1").css("left"));
        $("#inimigo1").css("left",posicaoX-velocidade);
        $("#inimigo1").css("top",posicaoY);
            if ( posicaoX <= 0 ) {
                posicaoY = parseInt(Math.random() * 334 );
                $("#inimigo1").css("left",694);
                $("#inimigo1").css("top",posicaoY);
            }

    }

    function moveInimigo2(){
        let posicaoX = parseInt($("#inimigo2").css("left"));
        $("#inimigo2").css("left",posicaoX-3)

        if ( posicaoX <= 0 ) {
            $("#inimigo2").css("left",775);
        }
    }

    function moveAmigo() {
        
        let posicaoX = parseInt($("#amigo").css("left"));
        $("#amigo").css("left",posicaoX+1);
        if ( posicaoX > 906 ) {
            $("#amigo").css("left",0)
        }

    }

    function disparo() {
        if (podeAtirar==true) {
            podeAtirar=false;
            topo = parseInt($("#jogador").css("top"));
            posicaoX = parseInt($("#jogador").css("left"));
            tiroX = posicaoX + 190 ;
            topoTiro = topo + 37 ;
            $("#fundodoGame").append("<div id='disparo'></div>")
            $("#disparo").css("top",topoTiro);
            $("#disparo").css("left",tiroX);
            somDisparo.play();

            var tempoDisparo=window.setInterval(executaDisparo , 30);

        }

        function executaDisparo() {
                let posicaoXb = parseInt($("#disparo").css("left"));
                $("#disparo").css("left",posicaoXb+15);
                if ( posicaoXb > 900 ) {
                    window.clearInterval(tempoDisparo);
                    tempoDisparo=null;
                    $("#disparo").remove();
                    podeAtirar=true;
                }
        }


    }

    function colisao() {
        let colisao1 = ($("#jogador").collision($("#inimigo1")));
        let colisao2 = ($("#jogador").collision($("#inimigo2")));
        let colisao3 = ($("#disparo").collision($("#inimigo1")));
        let colisao4 = ($("#disparo").collision($("#inimigo2")));
        let colisao5 = ($("#jogador").collision($("#amigo")));
        let colisao6 = ($("#inimigo2").collision($("#amigo")));
        
        if ( colisao1.length > 0 ) {
            let inimigo1X = parseInt($("#inimigo1").css("left"));
            let inimigo1Y = parseInt($("#inimigo1").css("top"));
            explosao1(inimigo1X,inimigo1Y);
            pontos = pontos + 50 ;
            energiaAtual--;
            somExplosao.play()

            let posicaoY = parseInt(Math.random() * 334);
            $("#inimigo1").css("left",694);
            $("#inimigo1").css("top",posicaoY);
        }

        if ( colisao2.length > 0 ) {
            somExplosao.play();
            inimigo2X = parseInt($("#inimigo2").css("left"));
            inimigo2Y = parseInt($("#inimigo2").css("top"));
            explosao2(inimigo2X,inimigo2Y);

            pontos = pontos + 50 ;
            energiaAtual--;
            $("#inimigo2").remove();
                
            reposicionaInimigo2();
                
        }
        
        if ( colisao3.length > 0 ) {
		
            somExplosao.play();
            inimigo1X = parseInt($("#inimigo1").css("left"));
            inimigo1Y = parseInt($("#inimigo1").css("top"));
            velocidade = velocidade + 1 ;    
            explosao1(inimigo1X,inimigo1Y);
            pontos = pontos + 100 ;
            $("#disparo").css("left",950);
                
            posicaoY = parseInt(Math.random() * 334);
            $("#inimigo1").css("left",694);
            $("#inimigo1").css("top",posicaoY);
                
        }

        if ( colisao4.length > 0 ) {
            somExplosao.play();
            inimigo2X = parseInt($("#inimigo2").css("left"));
            inimigo2Y = parseInt($("#inimigo2").css("top"));
            $("#inimigo2").remove();
        
            explosao2(inimigo2X,inimigo2Y);
            pontos = pontos + 100 ;
            $("#disparo").css("left",950);
            
            reposicionaInimigo2();
                
        }

        if ( colisao5.length > 0 ) {
            salvos++;	
            somResgate.play();	
            reposicionaAmigo();
            $("#amigo").remove();
        }

        if (colisao6.length>0) {
	    
            amigoX = parseInt($("#amigo").css("left"));
            amigoY = parseInt($("#amigo").css("top"));
            explosao3(amigoX,amigoY);
            perdidos++;
            $("#amigo").remove();
                    
            reposicionaAmigo();
                    
        }
            

        function explosao2(inimigo2X,inimigo2Y) {
	
            $("#fundodoGame").append("<div id='explosao2'></div");
            $("#explosao2").css("background-image", "url(imgs/explosao.png)");
            var div2=$("#explosao2");
            div2.css("top", inimigo2Y);
            div2.css("left", inimigo2X);
            div2.animate({width:200, opacity:0}, "slow");
            
            var tempoExplosao2=window.setInterval(removeExplosao2, 1000);
            
                function removeExplosao2() {
                    
                    div2.remove();
                    window.clearInterval(tempoExplosao2);
                    tempoExplosao2=null;
                    
                }
                
                
        }

        function reposicionaInimigo2() {
	
            var tempoColisao4=window.setInterval(reposiciona4, 5000);
                
            function reposiciona4() {
            window.clearInterval(tempoColisao4);
            tempoColisao4=null;
                 
                 if (fimdejogo==false) {
                    
                 $("#fundodoGame").append("<div id=inimigo2></div");
                    
                }
                    
            }	
        }	
        


        


        
    }

    function explosao1(x,y) {
        $("#fundodoGame").append("<div id='explosao1'></div>");
        let div=$("#explosao1")
        div.css("background-image" , "url(imgs/explosao.png)");
        div.css("top",y);
        div.css("left",x);
        div.animate({width:200, opacity:0},"slow");
        let tempoExplosao=window.setInterval(removeExplosao,1000);
        
        function removeExplosao() {
            div.remove();
            window.clearInterval(tempoExplosao)
            tempoExplosao=null;
        }
    }

    function reposicionaAmigo() {
	
        var tempoAmigo=window.setInterval(reposiciona6, 6000);
        
            function reposiciona6() {
            window.clearInterval(tempoAmigo);
            tempoAmigo=null;
            
            if (fimdejogo==false) {
            
            $("#fundodoGame").append("<div id='amigo' class='anima3'></div>");
            
            }
            
        }
        
    }

    function explosao3(amigoX,amigoY) {
        $("#fundodoGame").append("<div id='explosao3' class='anima4'></div");
        $("#explosao3").css("top",amigoY);
        $("#explosao3").css("left",amigoX);
        var tempoExplosao3=window.setInterval(resetaExplosao3, 1000);
        function resetaExplosao3() {
        $("#explosao3").remove();
        window.clearInterval(tempoExplosao3);
        tempoExplosao3=null;
                
        }
        
    }

    function placar() {
        $("#placar").html("<h2> Pontos: " + pontos + " Salvos: " + salvos + " Perdidos: " + perdidos + "</h2>");
    }
    
    function energia() {
        if ( energiaAtual == 3 ) {
			
			$("#energia").css("background-image", "url(imgs/energia3.png)");
		}
	
		if ( energiaAtual == 2 ) {
			
			$("#energia").css("background-image", "url(imgs/energia2.png)");
		}
	
		if ( energiaAtual == 1 ) {
			
			$("#energia").css("background-image", "url(imgs/energia1.png)");
		}
	
		if ( energiaAtual == 0 ) {
			
			$("#energia").css("background-image", "url(imgs/energia0.png)");
			gameover() ;
			
		}
	
	
    }

    function gameover() {
        fimdejogo=true;
        musica.pause();
        somGameover.play();
        
        window.clearInterval(jogo.timer);
        jogo.timer=null;
        
        $("#jogador").remove();
        $("#inimigo1").remove();
        $("#inimigo2").remove();
        $("#amigo").remove();
        
        $("#fundodoGame").append("<div id='fim'></div>");
        
        $("#fim").html("<h1> Game Over </h1><p>Sua pontuação foi: " + pontos + "</p>" + "<div id='reinicia' onClick=reiniciaJogo()><h3>Jogar Novamente</h3></div>");
         // Fim da função gameOver();
        
         


    }

    



}

function reiniciaJogo() {
    somGameover.pause();
    $("#fim").remove();
    start();
    
}    
document.getElementById("inicio").addEventListener("click", function() {
    start();
})

musica.addEventListener("ended", function(){ 
    musica.currentTime = 0; musica.play(); },false);




