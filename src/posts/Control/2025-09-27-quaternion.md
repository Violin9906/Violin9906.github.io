---
icon: pen-to-square
date: 2025-09-27
tag:
  - Robotics
  - Automation
---

# 旋转矩阵与四元数

## 用旋转矩阵描述旋转

<center><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0" y="0" width="300" height="300" style="width:300px;height:300px;background: #FFF;fill: none;"><svg xmlns="http://www.w3.org/2000/svg" class="role-diagram-draw-area"><g class="shapes-region" style="stroke: black; fill: none;"><g class="grouped-shape"><g class="composite-shape axis2d" style="stroke-width: 1; stroke: rgb(0, 0, 0);"><path class="real" d=" M103,131.6 L203,131.6 M117,48 L117,148"/><path d=" M196,126.6 L203,131.6 L196,136.6"/><path d=" M112,55 L117,48 L122,55"/></g><g class="arrow-line"><path class="connection real" stroke-dasharray="" d="  M129.2,119.6 L75.59,175.16" style="stroke: rgb(0, 0, 0); stroke-width: 1; fill: none; fill-opacity: 1;"/><g stroke="#000" transform="matrix(0.6944072311839579,-0.7195822380238615,0.7195822380238615,0.6944072311839579,74.19998168945312,176.5999984741211)" style="stroke: rgb(0, 0, 0); stroke-width: 1;"><path d=" M10.93,-3.29 Q4.96,-0.45 0,0 Q4.96,0.45 10.93,3.29"/></g></g></g><g class="grouped-shape"><g class="composite-shape axis2d" style="stroke-width: 1; stroke: rgb(0, 0, 0);"><path class="real" d=" M104.24,138.7 L191.1,89.16 M74.98,59.15 L124.53,146.01"/><path d=" M182.54,88.28 L191.1,89.16 L187.5,96.97"/><path d=" M74.1,67.71 L74.98,59.15 L82.79,62.75"/></g><g class="arrow-line"><path class="connection real" stroke-dasharray="" d="  M121.05,115.3 L102.01,190.12" style="stroke: rgb(0, 0, 0); stroke-width: 1; fill: none; fill-opacity: 1;"/><g stroke="#000" transform="matrix(0.2466607473812378,-0.9691018912897287,0.9691018912897287,0.2466607473812378,101.51810536454684,192.06054773582963)" style="stroke: rgb(0, 0, 0); stroke-width: 1;"><path d=" M10.93,-3.29 Q4.96,-0.45 0,0 Q4.96,0.45 10.93,3.29"/></g></g></g><g class="arrow-line"><path class="connection real" stroke-dasharray="6 6" d="  M156.33,107.7 L156.33,162.7" style="stroke: rgb(0, 0, 0); stroke-width: 1; fill: none; fill-opacity: 1;"/></g><g class="arrow-line"><path class="connection real" stroke-dasharray="6 6" d="  M156.33,162.7 L87.33,162.7" style="stroke: rgb(0, 0, 0); stroke-width: 1; fill: none; fill-opacity: 1;"/></g><g class="arrow-line"><path class="connection real" stroke-dasharray="6 6" d="  M188.33,132.7 L156.33,162.7" style="stroke: rgb(0, 0, 0); stroke-width: 1; fill: none; fill-opacity: 1;"/></g><g/></g><g/><g/><g/></svg><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="660.0000610351562" height="300.0000305175781" style="width:660.0000610351562px;height:300.0000305175781px;font-family:Asana-Math, Asana;background:#FFF;"><g><g><g><g transform="matrix(1,0,0,1,54.5333251953125,190.53335571289062)"><path transform="matrix(0.017,0,0,-0.017,0,0)" d="M9 1C24 -7 40 -11 52 -11C85 -11 124 18 155 65L231 182L242 113C255 28 278 -11 314 -11C336 -11 368 6 400 35L449 79L440 98C404 68 379 53 363 53C348 53 335 63 325 83C316 102 305 139 300 168L282 269L317 318C364 383 391 406 422 406C438 406 450 398 455 383L469 387L484 472C472 479 463 482 454 482C414 482 374 446 312 354L275 299L269 347C257 446 230 482 171 482C145 482 123 474 114 461L56 378L73 368C103 402 123 416 142 416C175 416 197 375 214 277L225 215L185 153C142 86 108 54 80 54C65 54 54 58 52 63L41 91L21 88C21 53 13 27 9 1Z" stroke="rgb(0,0,0)" stroke-opacity="1" stroke-width="8" fill="rgb(0,0,0)" fill-opacity="1"></path></g></g><g><g><g><g><g transform="matrix(1,0,0,1,63.5250244140625,193.54169311523438)"><path transform="matrix(0.0119,0,0,-0.0119,0,0)" d="M263 689C108 689 29 566 29 324C29 207 50 106 85 57C120 8 176 -20 238 -20C389 -20 465 110 465 366C465 585 400 689 263 689ZM245 654C342 654 381 556 381 316C381 103 343 15 251 15C154 15 113 116 113 360C113 571 150 654 245 654Z" stroke="rgb(0,0,0)" stroke-opacity="1" stroke-width="8" fill="rgb(0,0,0)" fill-opacity="1"></path></g></g></g></g></g></g></g><g><g><g><g transform="matrix(1,0,0,1,96.5333251953125,208.53335571289062)"><path transform="matrix(0.017,0,0,-0.017,0,0)" d="M9 1C24 -7 40 -11 52 -11C85 -11 124 18 155 65L231 182L242 113C255 28 278 -11 314 -11C336 -11 368 6 400 35L449 79L440 98C404 68 379 53 363 53C348 53 335 63 325 83C316 102 305 139 300 168L282 269L317 318C364 383 391 406 422 406C438 406 450 398 455 383L469 387L484 472C472 479 463 482 454 482C414 482 374 446 312 354L275 299L269 347C257 446 230 482 171 482C145 482 123 474 114 461L56 378L73 368C103 402 123 416 142 416C175 416 197 375 214 277L225 215L185 153C142 86 108 54 80 54C65 54 54 58 52 63L41 91L21 88C21 53 13 27 9 1Z" stroke="rgb(0,0,0)" stroke-opacity="1" stroke-width="8" fill="rgb(0,0,0)" fill-opacity="1"></path></g></g><g><g><g><g><g transform="matrix(1,0,0,1,105.5250244140625,211.54169311523438)"><path transform="matrix(0.0119,0,0,-0.0119,0,0)" d="M418 -3L418 27L366 30C311 33 301 44 301 96L301 700L60 598L67 548L217 614L217 96C217 44 206 33 152 30L96 27L96 -3C250 0 250 0 261 0C292 0 402 -3 418 -3Z" stroke="rgb(0,0,0)" stroke-opacity="1" stroke-width="8" fill="rgb(0,0,0)" fill-opacity="1"></path></g></g></g></g></g></g></g><g><g><g><g transform="matrix(1,0,0,1,204.5333251953125,136.53335571289062)"><path transform="matrix(0.017,0,0,-0.017,0,0)" d="M-7 -180C-8 -187 -8 -193 -8 -198C-8 -241 29 -276 74 -276C180 -276 290 -152 349 33L490 473L479 482C450 471 427 465 405 463L370 331C358 284 323 211 290 162C255 111 206 67 184 67C172 67 163 90 164 115L180 322C182 353 184 391 184 419C184 464 177 482 160 482C147 482 133 475 85 442L3 386L14 368L64 398C69 401 80 410 89 410C103 410 111 391 111 358C111 357 111 351 110 343L93 100L92 60C92 18 110 -11 135 -11C172 -11 256 74 331 187L282 16C231 -161 181 -234 111 -234C76 -234 49 -207 49 -172C49 -167 50 -159 51 -150L41 -146Z" stroke="rgb(0,0,0)" stroke-opacity="1" stroke-width="8" fill="rgb(0,0,0)" fill-opacity="1"></path></g></g><g><g><g><g><g transform="matrix(1,0,0,1,213.5250244140625,139.54166259765626)"><path transform="matrix(0.0119,0,0,-0.0119,0,0)" d="M263 689C108 689 29 566 29 324C29 207 50 106 85 57C120 8 176 -20 238 -20C389 -20 465 110 465 366C465 585 400 689 263 689ZM245 654C342 654 381 556 381 316C381 103 343 15 251 15C154 15 113 116 113 360C113 571 150 654 245 654Z" stroke="rgb(0,0,0)" stroke-opacity="1" stroke-width="8" fill="rgb(0,0,0)" fill-opacity="1"></path></g></g></g></g></g></g></g><g><g><g><g transform="matrix(1,0,0,1,108.5333251953125,42.53334045410156)"><path transform="matrix(0.017,0,0,-0.017,0,0)" d="M322 -11C334 -11 343 -9 372 -1C383 61 391 95 402 142L380 142L358 82C352 64 340 57 319 57C307 57 291 59 270 64L252 68C219 75 185 80 166 80C134 80 107 74 71 59L410 441L416 473L407 482L384 459C374 449 364 445 350 445C316 445 264 453 216 466L198 471C170 478 150 482 136 482C119 482 99 479 75 472L43 350L64 350L94 408C111 412 120 413 133 413C174 413 206 398 259 398C295 398 319 404 352 421L-1 21L8 -6C37 17 64 26 99 26C162 26 253 -11 322 -11Z" stroke="rgb(0,0,0)" stroke-opacity="1" stroke-width="8" fill="rgb(0,0,0)" fill-opacity="1"></path></g></g><g><g><g><g><g transform="matrix(1,0,0,1,116.57501220703125,45.54167785644531)"><path transform="matrix(0.0119,0,0,-0.0119,0,0)" d="M263 689C108 689 29 566 29 324C29 207 50 106 85 57C120 8 176 -20 238 -20C389 -20 465 110 465 366C465 585 400 689 263 689ZM245 654C342 654 381 556 381 316C381 103 343 15 251 15C154 15 113 116 113 360C113 571 150 654 245 654Z" stroke="rgb(0,0,0)" stroke-opacity="1" stroke-width="8" fill="rgb(0,0,0)" fill-opacity="1"></path></g></g></g></g></g></g></g><g><g><g><g transform="matrix(1,0,0,1,197.5333251953125,93.53335571289062)"><path transform="matrix(0.017,0,0,-0.017,0,0)" d="M-7 -180C-8 -187 -8 -193 -8 -198C-8 -241 29 -276 74 -276C180 -276 290 -152 349 33L490 473L479 482C450 471 427 465 405 463L370 331C358 284 323 211 290 162C255 111 206 67 184 67C172 67 163 90 164 115L180 322C182 353 184 391 184 419C184 464 177 482 160 482C147 482 133 475 85 442L3 386L14 368L64 398C69 401 80 410 89 410C103 410 111 391 111 358C111 357 111 351 110 343L93 100L92 60C92 18 110 -11 135 -11C172 -11 256 74 331 187L282 16C231 -161 181 -234 111 -234C76 -234 49 -207 49 -172C49 -167 50 -159 51 -150L41 -146Z" stroke="rgb(0,0,0)" stroke-opacity="1" stroke-width="8" fill="rgb(0,0,0)" fill-opacity="1"></path></g></g><g><g><g><g><g transform="matrix(1,0,0,1,206.5250244140625,96.54166259765626)"><path transform="matrix(0.0119,0,0,-0.0119,0,0)" d="M418 -3L418 27L366 30C311 33 301 44 301 96L301 700L60 598L67 548L217 614L217 96C217 44 206 33 152 30L96 27L96 -3C250 0 250 0 261 0C292 0 402 -3 418 -3Z" stroke="rgb(0,0,0)" stroke-opacity="1" stroke-width="8" fill="rgb(0,0,0)" fill-opacity="1"></path></g></g></g></g></g></g></g><g><g><g><g transform="matrix(1,0,0,1,57.5333251953125,57.53334045410156)"><path transform="matrix(0.017,0,0,-0.017,0,0)" d="M322 -11C334 -11 343 -9 372 -1C383 61 391 95 402 142L380 142L358 82C352 64 340 57 319 57C307 57 291 59 270 64L252 68C219 75 185 80 166 80C134 80 107 74 71 59L410 441L416 473L407 482L384 459C374 449 364 445 350 445C316 445 264 453 216 466L198 471C170 478 150 482 136 482C119 482 99 479 75 472L43 350L64 350L94 408C111 412 120 413 133 413C174 413 206 398 259 398C295 398 319 404 352 421L-1 21L8 -6C37 17 64 26 99 26C162 26 253 -11 322 -11Z" stroke="rgb(0,0,0)" stroke-opacity="1" stroke-width="8" fill="rgb(0,0,0)" fill-opacity="1"></path></g></g><g><g><g><g><g transform="matrix(1,0,0,1,65.57501220703125,60.54167785644531)"><path transform="matrix(0.0119,0,0,-0.0119,0,0)" d="M418 -3L418 27L366 30C311 33 301 44 301 96L301 700L60 598L67 548L217 614L217 96C217 44 206 33 152 30L96 27L96 -3C250 0 250 0 261 0C292 0 402 -3 418 -3Z" stroke="rgb(0,0,0)" stroke-opacity="1" stroke-width="8" fill="rgb(0,0,0)" fill-opacity="1"></path></g></g></g></g></g></g></g></svg></svg></center>

如图所示，坐标系$Ox_1y_1z_1$为$Ox_0y_0z_0$旋转得到，记其三个单位基向量$x_1$, $y_1$, $z_1$在$Ox_0y_0z_0$系下的坐标表示分别为$x^0_1$, $y^0_1$, $z^0_1$，则旋转矩阵为：
$$
R^0_1=\left[ x^0_1 | y^0_1 | z^0_1 \right]
$$
根据内积的定义，有
$$
R^0_1=\left[\begin{matrix}
x_1\cdot x_0 & y_1 \cdot x_0 & z_1 \cdot x_0 \\
x_1\cdot y_0 & y_1 \cdot y_0 & z_1 \cdot y_0 \\
x_1\cdot z_0 & y_1 \cdot z_0 & z_1 \cdot z_0 \\
\end{matrix}\right]
$$
绕x, y, z三个轴旋转$\theta$角的旋转矩阵为：
$$
R_{x,\theta}=\left[\begin{matrix}
1 & 0 & 0\\
0 & \cos\theta & -\sin\theta\\
0 & \sin\theta & \cos\theta\\
\end{matrix}\right]
$$

$$
R_{y,\theta}=\left[\begin{matrix}
\cos\theta & 0 & \sin\theta \\
0 & 1 & 0 \\
-\sin\theta & 0 & \cos\theta
\end{matrix}\right]
$$

$$
R_{z,\theta}=\left[\begin{matrix}
\cos\theta & -\sin\theta & 0 \\
\sin\theta & \cos\theta & 0 \\
0 & 0 & 1 \\
\end{matrix}\right]
$$

:::info
下文的旋转矩阵、向量、四元数等都用右上标表明是在哪个坐标系下描述的。
:::

## 旋转矩阵的性质

- $R^T=R^{-1}$
- $R\in SO(3)$
- $\det(R)=1$
- $R$的各行、各列相互正交，且都是单位向量

## 用旋转矩阵表示坐标变换

- 点/向量坐标变换：

$$
p^0=R^0_1p^1
$$

- 线性变换的坐标变换：

$$
T^1=(R^0_1)^{-1}T^0R^0_1
$$

:::tip
这个变换在线性代数里面叫做相似变换，其几何意义就是在不同坐标系下对同一矩阵（线性变换）的不同表示。
:::

:::important
特殊地，线性变换$T$可以是以一个旋转矩阵来描述的旋转运动，由此就得到了旋转运动在不同坐标系下的变换：
$$
R^1=(R^0_1)^{-1}R^0R^0_1
$$
:::

## 旋转的叠加

- 绕随动坐标系的叠加：根据叠加的顺序，依次**右乘**旋转矩阵

- 绕固定坐标系的叠加：根据叠加的顺序，依次**左乘**旋转矩阵

:::note 证明

记绕固定坐标系的旋转为$R$，则$R^0_2=R^0_1((R^0_1)^{-1}RR^0_1)=RR^0_1$

:::

## 旋转的转轴-角度表示

可以证明，三维刚体的任意旋转及其叠加，都可以用一个转轴（方向向量）和绕这个轴的旋转角度表示。记转轴$\vec{k}=[k_x\;k_y\;k_z]^T$，角度为$\theta$，则
$$
R_{\vec{k},\theta}=\left[\begin{matrix}
k_x^2v_\theta+c_\theta & k_xk_yv_\theta-k_zs_\theta & k_xk_zv_\theta+k_ys_\theta \\
k_xk_yv_\theta+k_zs_\theta & k_y^2v_\theta+c_\theta & k_yk_zv_\theta-k_xs_\theta \\
k_xk_zv_\theta-k_ys_\theta & k_yk_zv_\theta+k_xs_\theta & k_z^2v_\theta+c_\theta
\end{matrix}\right]
$$

其中$c_\theta=\cos\theta$，$s_\theta=\sin\theta$，$v_\theta=\mathrm{versine}\theta=1-\cos\theta$。


:::info
全部的三角函数

<center><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="圖層_1" x="0px" y="0px" width="300px" height="auto" viewBox="0 0 1265 865" enable-background="new 0 0 1265 865" xml:space="preserve"><g transform="scale(3.7) translate(0, -8)"><g id="g-points"><switch><text transform="matrix(0.2703 0 0 0.2703 88.3245 143.4054)" font-family="'ArialMT'" font-size="59.2" id="trsvg33-pt-br" systemLanguage="pt-br"><tspan id="trsvg1-pt-br">O</tspan></text><text transform="matrix(0.2703 0 0 0.2703 88.3245 143.4054)" font-family="'ArialMT'" font-size="59.2" id="trsvg33"><tspan id="trsvg1">O</tspan></text></switch><switch><text transform="matrix(0.2703 0 0 0.2703 114.3243 123.4054)" font-family="'Arial-ItalicMT'" font-size="59.2" id="trsvg34-pt-br" systemLanguage="pt-br"><tspan id="trsvg2-pt-br">θ</tspan></text><text transform="matrix(0.2703 0 0 0.2703 114.3243 123.4054)" font-family="'Arial-ItalicMT'" font-size="59.2" id="trsvg34"><tspan id="trsvg2">θ</tspan></text></switch><switch><text transform="matrix(0.2703 0 0 0.2703 147.3247 47.4051)" font-family="'ArialMT'" font-size="59.2" id="trsvg35-pt-br" systemLanguage="pt-br"><tspan id="trsvg3-pt-br">A</tspan></text><text transform="matrix(0.2703 0 0 0.2703 147.3247 47.4051)" font-family="'ArialMT'" font-size="59.2" id="trsvg35"><tspan id="trsvg3">A</tspan></text></switch><switch><text transform="matrix(0.2703 0 0 0.2703 144.3243 226.1619)" font-family="'ArialMT'" font-size="59.2" id="trsvg36-pt-br" systemLanguage="pt-br"><tspan id="trsvg4-pt-br">B</tspan></text><text transform="matrix(0.2703 0 0 0.2703 144.3243 226.1619)" font-family="'ArialMT'" font-size="59.2" id="trsvg36"><tspan id="trsvg4">B</tspan></text></switch><switch><text transform="matrix(0.2703 0 0 0.2703 147.3247 125.4055)" font-family="'ArialMT'" font-size="59.2" id="trsvg37-pt-br" systemLanguage="pt-br"><tspan id="trsvg5-pt-br">C</tspan></text><text transform="matrix(0.2703 0 0 0.2703 147.3247 125.4055)" font-family="'ArialMT'" font-size="59.2" id="trsvg37"><tspan id="trsvg5">C</tspan></text></switch><switch><text transform="matrix(0.2703 0 0 0.2703 198.3245 145.4055)" font-family="'ArialMT'" font-size="59.2" id="trsvg38-pt-br" systemLanguage="pt-br"><tspan id="trsvg6-pt-br">D</tspan></text><text transform="matrix(0.2703 0 0 0.2703 198.3245 145.4055)" font-family="'ArialMT'" font-size="59.2" id="trsvg38"><tspan id="trsvg6">D</tspan></text></switch><switch><text transform="matrix(0.2703 0 0 0.2703 330.3246 145.4055)" font-family="'ArialMT'" font-size="59.2" id="trsvg39-pt-br" systemLanguage="pt-br"><tspan id="trsvg7-pt-br">E</tspan></text><text transform="matrix(0.2703 0 0 0.2703 330.3246 145.4055)" font-family="'ArialMT'" font-size="59.2" id="trsvg39"><tspan id="trsvg7">E</tspan></text></switch><switch><text transform="matrix(0.2703 0 0 0.2703 100.3246 25.4055)" font-family="'ArialMT'" font-size="59.2" id="trsvg40-pt-br" systemLanguage="pt-br"><tspan id="trsvg8-pt-br">F</tspan></text><text transform="matrix(0.2703 0 0 0.2703 100.3246 25.4055)" font-family="'ArialMT'" font-size="59.2" id="trsvg40"><tspan id="trsvg8">F</tspan></text></switch><switch><text transform="matrix(0.2703 0 0 0.2703 88.3245 65.4055)" font-family="'ArialMT'" font-size="59.2" id="trsvg41-pt-br" systemLanguage="pt-br"><tspan id="trsvg9-pt-br">G</tspan></text><text transform="matrix(0.2703 0 0 0.2703 88.3245 65.4055)" font-family="'ArialMT'" font-size="59.2" id="trsvg41"><tspan id="trsvg9">G</tspan></text></switch><switch><text transform="matrix(0.2703 0 0 0.2703 105.3246 43.4054)" font-family="'ArialMT'" font-size="59.2" id="trsvg42-pt-br" systemLanguage="pt-br"><tspan id="trsvg10-pt-br">H</tspan></text><text transform="matrix(0.2703 0 0 0.2703 105.3246 43.4054)" font-family="'ArialMT'" font-size="59.2" id="trsvg42"><tspan id="trsvg10">H</tspan></text></switch><switch><text transform="matrix(0.2703 0 0 0.2703 115.3246 85.4055)" font-family="'ArialMT'" font-size="59.2" id="trsvg43-pt-br" systemLanguage="pt-br"><tspan id="trsvg11-pt-br">1</tspan></text><text transform="matrix(0.2703 0 0 0.2703 115.3246 85.4055)" font-family="'ArialMT'" font-size="59.2" id="trsvg43"><tspan id="trsvg11">1</tspan></text></switch><switch><text transform="matrix(0.2703 0 0 0.2703 0.8108 136.9728)" font-family="'ArialMT'" font-size="59.2" id="trsvg44-pt-br" systemLanguage="pt-br"><tspan id="trsvg12-pt-br">K</tspan></text><text transform="matrix(0.2703 0 0 0.2703 0.8108 136.9728)" font-family="'ArialMT'" font-size="59.2" id="trsvg44"><tspan id="trsvg12">K</tspan></text></switch><switch><text transform="matrix(0.2703 0 0 0.2703 98.3245 236.4322)" font-family="'ArialMT'" font-size="59.2" id="trsvg45-pt-br" systemLanguage="pt-br"><tspan id="trsvg13-pt-br">L</tspan></text><text transform="matrix(0.2703 0 0 0.2703 98.3245 236.4322)" font-family="'ArialMT'" font-size="59.2" id="trsvg45"><tspan id="trsvg13">L</tspan></text></switch></g><g><g><line id="line-BC_4_" fill="none" stroke="#C8C8C8" stroke-width="1.415" stroke-miterlimit="8" stroke-dasharray="3,4" x1="64.406" y1="47.405" x2="32.424" y2="47.405"/></g><g><line id="line-BC" fill="none" stroke="#808080" stroke-width="1.415" stroke-miterlimit="8" stroke-dasharray="8,3" x1="142.324" y1="213.405" x2="142.324" y2="130.405"/></g><g><circle id="circle-O-HADB" fill="none" stroke="#000000" stroke-width="1.415" stroke-miterlimit="8" cx="103.325" cy="130.405" r="91.7"/><path id="arc-DA" fill="none" stroke="#000000" stroke-width="3" stroke-miterlimit="8" d="M195.025,130.405     c0.003-35.542-20.533-67.884-52.7-83"/><line id="line-OA-theta" fill="none" stroke="#000000" stroke-width="1.415" stroke-miterlimit="8" x1="103.325" y1="130.405" x2="142.324" y2="47.405"/><g><line id="line-OB-minus-theta" fill="none" stroke="#000000" stroke-width="1.415" stroke-miterlimit="8" stroke-dasharray="8,3" x1="103.325" y1="130.405" x2="142.324" y2="213.405"/></g><g><line id="line-A-dashed" fill="none" stroke="#000000" stroke-width="1.415" stroke-miterlimit="8" stroke-dasharray="3,4" x1="142.324" y1="47.405" x2="155.325" y2="19.405"/></g><path id="path-angle-theta" fill="none" stroke="#000000" stroke-width="1.415" stroke-miterlimit="8" d="M115.325,130.405     c0-4-3-9-7-11"/><polyline id="polyline-angle-ortho-O" fill="none" stroke="#000000" stroke-width="1.415" stroke-miterlimit="8" points="     93.325,130.405 93.325,120.405 103.325,120.405    "/><polyline id="polyline-angle-ortho-G" fill="none" stroke="#000000" stroke-width="1.415" stroke-miterlimit="8" points="     103.325,57.405 113.325,57.405 113.325,47.405    "/><polyline id="polyline-angle-ortho-C" fill="none" stroke="#000000" stroke-width="1.415" stroke-miterlimit="8" points="     132.324,130.405 132.324,120.405 142.324,120.405    "/><polyline id="polyline-angle-ortho-A" fill="none" stroke="#000000" stroke-width="1.415" stroke-miterlimit="8" points="     134.325,43.405 138.325,35.405 145.325,39.405    "/></g><line id="line-AD-crd" fill="none" stroke="#C0C0C0" stroke-width="1.415" stroke-miterlimit="8" x1="142.324" y1="47.405" x2="195.025" y2="130.405"/><line id="line-GA-cos" fill="none" stroke="#0000FF" stroke-width="1.415" stroke-miterlimit="8" x1="103.325" y1="47.405" x2="142.324" y2="47.405"/><line id="line-OC-cos" fill="none" stroke="#0000FF" stroke-width="1.415" stroke-miterlimit="8" x1="103.325" y1="130.405" x2="142.324" y2="130.405"/><line id="line-CD-versin" fill="none" stroke="#008000" stroke-width="1.415" stroke-miterlimit="8" x1="142.324" y1="130.405" x2="195.025" y2="130.405"/><line id="line-DE-exsec" fill="none" stroke="#FF69B4" stroke-width="1.415" stroke-miterlimit="8" x1="195.025" y1="130.405" x2="321.324" y2="130.405"/><g id="g-sec-lines"><g><line id="line-O-yneg" fill="none" stroke="#008B8B" stroke-width="1.415" stroke-miterlimit="8" stroke-dasharray="3,4" x1="103.325" y1="130.405" x2="103.325" y2="170.405"/><line id="line-E-yneg" fill="none" stroke="#008B8B" stroke-width="1.415" stroke-miterlimit="8" stroke-dasharray="3,4" x1="321.324" y1="130.405" x2="321.324" y2="170.405"/></g><line id="line-sec-parallel-OE" fill="none" stroke="#008B8B" stroke-width="1.415" stroke-miterlimit="8" x1="115.325" y1="175.405" x2="308.325" y2="175.405"/><line id="line-sec-ortho-O" fill="none" stroke="#008B8B" stroke-width="1.415" stroke-miterlimit="8" x1="103.325" y1="170.405" x2="103.325" y2="180.405"/><line id="line-sec-ortho-E" fill="none" stroke="#008B8B" stroke-width="1.415" stroke-miterlimit="8" x1="321.324" y1="170.405" x2="321.324" y2="180.405"/><g id="g-sec-arrowheads"><polyline id="polyline-sec-arrowhead-O" fill="#008B8B" points="115.325,170.405 115.325,180.405 103.325,175.405     "/><polyline id="polyline-sec-arrowhead-E" fill="#008B8B" points="308.325,170.405 308.325,180.405 321.324,175.405     "/></g></g><line id="line-CA-sin" fill="none" stroke="#FF0000" stroke-width="1.415" stroke-miterlimit="8" x1="142.324" y1="130.405" x2="142.324" y2="47.405"/><line id="line-OG-sin" fill="none" stroke="#FF0000" stroke-width="1.415" stroke-miterlimit="8" x1="103.325" y1="130.405" x2="103.325" y2="47.405"/><line id="line-HG-cvs" fill="none" stroke="#00FFFF" stroke-width="1.415" stroke-miterlimit="8" x1="103.325" y1="47.405" x2="103.325" y2="38.705"/><line id="line-HF-excsc" fill="none" stroke="#006400" stroke-width="1.415" stroke-miterlimit="8" x1="103.325" y1="38.705" x2="103.325" y2="29.405"/><g id="g-csc-lines"><g><line id="line-O-xneg" fill="none" stroke="#FFC0CB" stroke-width="1.415" stroke-miterlimit="8" stroke-dasharray="3,4" x1="103.325" y1="130.405" x2="63.325" y2="130.405"/><line id="line-F-xneg" fill="none" stroke="#FFC0CB" stroke-width="1.415" stroke-miterlimit="8" stroke-dasharray="3,4" x1="103.325" y1="29.405" x2="63.325" y2="29.405"/></g><line id="line-csc-parallel-OF" fill="none" stroke="#FFC0CB" stroke-width="1.415" stroke-miterlimit="8" x1="58.325" y1="118.405" x2="58.325" y2="41.405"/><line id="line-csc-ortho-O" fill="none" stroke="#FFC0CB" stroke-width="1.415" stroke-miterlimit="8" x1="53.325" y1="130.405" x2="63.325" y2="130.405"/><line id="line-csc-ortho-F" fill="none" stroke="#FFC0CB" stroke-width="1.415" stroke-miterlimit="8" x1="53.325" y1="29.405" x2="63.325" y2="29.405"/><g id="g-csc-arrowheads"><polyline id="polyline-csc-arrowhead-O" fill="#FFC0CB" points="53.325,118.405 63.325,118.405 58.325,130.405     "/><polyline id="polyline-csc-arrowhead-E" fill="#FFC0CB" points="53.325,41.405 63.325,41.405 58.325,29.405     "/></g></g><line id="line-FA-cot" fill="none" stroke="#FF8C00" stroke-width="1.415" stroke-miterlimit="8" x1="103.325" y1="29.405" x2="142.324" y2="47.405"/><line id="line-AE-tan" fill="none" stroke="#D2B48C" stroke-width="1.415" stroke-miterlimit="8" x1="142.324" y1="47.405" x2="321.324" y2="130.405"/><g><line id="line-BC_1_" fill="none" stroke="#808080" stroke-width="1.415" stroke-miterlimit="8" stroke-dasharray="3,4" x1="11.625" y1="171.905" x2="11.625" y2="130.405"/></g><g><line id="line-BC_2_" fill="none" stroke="#808080" stroke-width="1.415" stroke-miterlimit="8" stroke-dasharray="3,4" x1="103.325" y1="222.105" x2="31.162" y2="222.105"/></g><g><line id="line-BC_3_" fill="none" stroke="#808080" stroke-width="1.415" stroke-miterlimit="8" stroke-dasharray="8,3" x1="103.325" y1="47.405" x2="64.406" y2="47.405"/></g><line id="line-csc-parallel-OF_1_" fill="none" stroke="#B200DF" stroke-width="1.415" stroke-miterlimit="8" x1="43.595" y1="222.105" x2="43.595" y2="59.405"/><g id="g-csc-arrowheads_1_"><polyline id="polyline-csc-arrowhead-O_1_" fill="#B200DF" points="38.595,210.105 48.595,210.105 43.595,222.105    "/><polyline id="polyline-csc-arrowhead-E_1_" fill="#B200DF" points="38.595,59.405 48.595,59.405 43.595,47.405    "/></g><line id="line-sec-parallel-OE_1_" fill="none" stroke="#4AACFF" stroke-width="1.415" stroke-miterlimit="8" x1="23.624" y1="156.155" x2="142.324" y2="156.155"/><g id="g-sec-arrowheads_1_"><polyline id="polyline-sec-arrowhead-O_1_" fill="#4AACFF" points="23.624,151.155 23.624,161.155 11.625,156.155    "/><polyline id="polyline-sec-arrowhead-E_1_" fill="#4AACFF" points="129.325,151.155 129.325,161.155 142.324,156.155    "/></g><g><line id="line-BC_5_" fill="none" stroke="#808080" stroke-width="1.415" stroke-miterlimit="8" stroke-dasharray="8,3" x1="53.325" y1="130.405" x2="11.624" y2="130.405"/></g><g><line id="line-BC_6_" fill="none" stroke="#808080" stroke-width="1.415" stroke-miterlimit="8" stroke-dasharray="8,3" x1="103.325" y1="180.405" x2="103.325" y2="222.103"/></g></g><g><switch><text transform="matrix(0.2703 0 0 0.2703 144.3243 93.4054)" fill="#FF0000" font-family="'ArialMT'" font-size="51.8" id="trsvg46-pt-br" systemLanguage="pt-br"><tspan id="trsvg14-pt-br">sen</tspan></text><text transform="matrix(0.2703 0 0 0.2703 144.3243 93.4054)" fill="#FF0000" font-family="'ArialMT'" font-size="51.8" id="trsvg46"><tspan id="trsvg14">sin</tspan></text></switch><switch><text transform="matrix(0.2703 0 0 0.2703 62.1352 46.5945)" fill="#00FFFF" font-family="'ArialMT'" font-size="34" id="trsvg47-pt-br" systemLanguage="pt-br"><tspan id="trsvg15-pt-br">sencover</tspan></text><text transform="matrix(0.2703 0 0 0.2703 62.1352 46.5945)" fill="#00FFFF" font-family="'ArialMT'" font-size="34" id="trsvg47"><tspan id="trsvg15">coversin</tspan></text></switch><switch><text transform="matrix(0.2703 0 0 0.2703 61.3244 38.4054)" fill="#006400" font-family="'ArialMT'" font-size="51.8" id="trsvg48-pt-br" systemLanguage="pt-br"><tspan id="trsvg16-pt-br">cscex</tspan></text><text transform="matrix(0.2703 0 0 0.2703 61.3244 38.4054)" fill="#006400" font-family="'ArialMT'" font-size="51.8" id="trsvg48"><tspan id="trsvg16">excsc</tspan></text></switch><switch><text transform="matrix(0.2703 0 0 0.2703 61.3244 81.4053)" fill="#FFC0CB" font-family="'ArialMT'" font-size="51.8" id="trsvg49-pt-br" systemLanguage="pt-br"><tspan id="trsvg17-pt-br">csc</tspan></text><text transform="matrix(0.2703 0 0 0.2703 61.3244 81.4053)" fill="#FFC0CB" font-family="'ArialMT'" font-size="51.8" id="trsvg49"><tspan id="trsvg17">csc</tspan></text></switch><switch><text transform="matrix(0.2703 0 0 0.2703 114.3243 143.4054)" fill="#0000FF" font-family="'ArialMT'" font-size="51.8" id="trsvg50-pt-br" systemLanguage="pt-br"><tspan id="trsvg18-pt-br">cos</tspan></text><text transform="matrix(0.2703 0 0 0.2703 114.3243 143.4054)" fill="#0000FF" font-family="'ArialMT'" font-size="51.8" id="trsvg50"><tspan id="trsvg18">cos</tspan></text></switch><switch><text transform="matrix(0.2703 0 0 0.2703 147.3247 143.4054)" fill="#008000" font-family="'ArialMT'" font-size="51.8" id="trsvg51-pt-br" systemLanguage="pt-br"><tspan id="trsvg19-pt-br">senver</tspan></text><text transform="matrix(0.2703 0 0 0.2703 147.3247 143.4054)" fill="#008000" font-family="'ArialMT'" font-size="51.8" id="trsvg51"><tspan id="trsvg19">versin</tspan></text></switch><switch><text transform="matrix(0.2703 0 0 0.2703 239.3243 143.4054)" fill="#FF69B4" font-family="'ArialMT'" font-size="51.8" id="trsvg52-pt-br" systemLanguage="pt-br"><tspan id="trsvg20-pt-br">secex</tspan></text><text transform="matrix(0.2703 0 0 0.2703 239.3243 143.4054)" fill="#FF69B4" font-family="'ArialMT'" font-size="51.8" id="trsvg52"><tspan id="trsvg20">exsec</tspan></text></switch><switch><text transform="matrix(0.2703 0 0 0.2703 199.3243 188.4054)" fill="#008B8B" font-family="'ArialMT'" font-size="51.8" id="trsvg53-pt-br" systemLanguage="pt-br"><tspan id="trsvg21-pt-br">sec</tspan></text><text transform="matrix(0.2703 0 0 0.2703 199.3243 188.4054)" fill="#008B8B" font-family="'ArialMT'" font-size="51.8" id="trsvg53"><tspan id="trsvg21">sec</tspan></text></switch><g id="g-crd" transform="rotate(56)"><switch><text transform="matrix(0.2703 0 0 0.2703 154.1363 -91.8783)" fill="#C0C0C0" font-family="'ArialMT'" font-size="51.8" id="trsvg54-pt-br" systemLanguage="pt-br"><tspan id="trsvg22-pt-br">crd</tspan></text><text transform="matrix(0.2703 0 0 0.2703 154.1363 -91.8783)" fill="#C0C0C0" font-family="'ArialMT'" font-size="51.8" id="trsvg54"><tspan id="trsvg22">crd</tspan></text></switch></g><switch><text transform="matrix(0.2703 0 0 0.2703 193.3245 105.4055)" font-family="'ArialMT'" font-size="51.8" id="trsvg55-pt-br" systemLanguage="pt-br"><tspan id="trsvg23-pt-br">arco</tspan></text><text transform="matrix(0.2703 0 0 0.2703 193.3245 105.4055)" font-family="'ArialMT'" font-size="51.8" id="trsvg55"><tspan id="trsvg23">arc</tspan></text></switch><g id="g-tan" transform="rotate(25)"><switch><text transform="matrix(0.2703 0 0 0.2703 114.8289 -20.6191)" fill="#FF8C00" font-family="'ArialMT'" font-size="51.8" id="trsvg56-pt-br" systemLanguage="pt-br"><tspan id="trsvg24-pt-br">cot</tspan></text><text transform="matrix(0.2703 0 0 0.2703 114.8289 -20.6191)" fill="#FF8C00" font-family="'ArialMT'" font-size="51.8" id="trsvg56"><tspan id="trsvg24">cot</tspan></text></switch><switch><text transform="matrix(0.2703 0 0 0.2703 224.8284 -20.6192)" fill="#D2B48C" font-family="'ArialMT'" font-size="51.8" id="trsvg57-pt-br" systemLanguage="pt-br"><tspan id="trsvg25-pt-br">tan</tspan></text><text transform="matrix(0.2703 0 0 0.2703 224.8284 -20.6192)" fill="#D2B48C" font-family="'ArialMT'" font-size="51.8" id="trsvg57"><tspan id="trsvg25">tan</tspan></text></switch></g><switch><text transform="matrix(0.2703 0 0 0.2703 57.2436 166.6486)" fill="#4AACFF" font-family="'ArialMT'" font-size="51.8" id="trsvg58-pt-br" systemLanguage="pt-br"><tspan id="trsvg26-pt-br">cosver</tspan></text><text transform="matrix(0.2703 0 0 0.2703 57.2436 166.6486)" fill="#4AACFF" font-family="'ArialMT'" font-size="51.8" id="trsvg58"><tspan id="trsvg26">vercos</tspan></text></switch><switch><text transform="matrix(1.213421e-011 -0.2703 0.2703 1.213421e-011 39.5165 143.4054)" fill="#B200DF" font-family="'ArialMT'" font-size="51.8" id="trsvg59-pt-br" systemLanguage="pt-br"><tspan id="trsvg27-pt-br">coscover</tspan></text><text transform="matrix(1.213421e-011 -0.2703 0.2703 1.213421e-011 39.5165 143.4054)" fill="#B200DF" font-family="'ArialMT'" font-size="51.8" id="trsvg59"><tspan id="trsvg27">covercos</tspan></text></switch><switch><text transform="matrix(0.2703 0 0 0.2703 235.5405 27.9593)" fill="#008B8B" font-family="'ArialMT'" font-size="36" id="trsvg60-pt-br" systemLanguage="pt-br"><tspan id="trsvg28-pt-br">sec=OE</tspan></text><text transform="matrix(0.2703 0 0 0.2703 235.5405 27.9593)" fill="#008B8B" font-family="'ArialMT'" font-size="36" id="trsvg60"><tspan id="trsvg28">sec=OE</tspan></text></switch><switch><text transform="matrix(0.2703 0 0 0.2703 235.5405 37.6891)" fill="#FFC0CB" font-family="'ArialMT'" font-size="36" id="trsvg61-pt-br" systemLanguage="pt-br"><tspan id="trsvg29-pt-br">csc=OF</tspan></text><text transform="matrix(0.2703 0 0 0.2703 235.5405 37.6891)" fill="#FFC0CB" font-family="'ArialMT'" font-size="36" id="trsvg61"><tspan id="trsvg29">csc=OF</tspan></text></switch><switch><text transform="matrix(0.2703 0 0 0.2703 235.5405 47.2296)" fill="#4AACFF" font-family="'ArialMT'" font-size="36" id="trsvg62-pt-br" systemLanguage="pt-br"><tspan id="trsvg30-pt-br">cosver=CK</tspan></text><text transform="matrix(0.2703 0 0 0.2703 235.5405 47.2296)" fill="#4AACFF" font-family="'ArialMT'" font-size="36" id="trsvg62"><tspan id="trsvg30">vercos=CK</tspan></text></switch><switch><text transform="matrix(0.2703 0 0 0.2703 235.5405 65.2297)" fill="#B200DF" font-family="'ArialMT'" font-size="36" id="trsvg63-pt-br" systemLanguage="pt-br"><tspan id="trsvg31-pt-br">coscover=GL</tspan></text><text transform="matrix(0.2703 0 0 0.2703 235.5405 65.2297)" fill="#B200DF" font-family="'ArialMT'" font-size="36" id="trsvg63"><tspan id="trsvg31">covercos=GL</tspan></text></switch><switch><text transform="matrix(0.2703 0 0 0.2703 235.5405 56.4188)" fill="#00FFFF" font-family="'ArialMT'" font-size="36" id="trsvg64-pt-br" systemLanguage="pt-br"><tspan id="trsvg32-pt-br">sencover=GH</tspan></text><text transform="matrix(0.2703 0 0 0.2703 235.5405 56.4188)" fill="#00FFFF" font-family="'ArialMT'" font-size="36" id="trsvg64"><tspan id="trsvg32">coversin=GH</tspan></text></switch></g></g></svg></center>

:::

反过来，对旋转矩阵
$$
R=\left[\begin{matrix}
r_{11} & r_{12} & r_{13} \\
r_{21} & r_{22} & r_{23} \\
r_{31} & r_{32} & r_{33} \\
\end{matrix}\right]
$$
则有
$$
\theta=\arccos\left(\frac{\mathrm{tr}(R)-1}{2}\right)
$$

$$
k=\frac{1}{2\sin\theta}\left[\begin{matrix}
r_{32}-r_{23} \\
r_{13}-r_{31} \\
r_{21}-r_{12} \\
\end{matrix}\right]
$$

转轴和角度不是唯一的，绕一个方向旋转$\theta$等同于绕相反方向旋转$-\theta$：
$$
R_{\vec{k},\theta} = R_{-\vec{k},-\theta}
$$

## 四元数

- 定义：$\mathscr{i},\mathscr{j},\mathscr{k}$是正交的三个虚数单位，$\mathscr{i}^2=\mathscr{j}^2=\mathscr{k}^2=\mathscr{i}\mathscr{j}\mathscr{k}=-1$，$a,b,c,d\in\mathbb{R}$，则
  $$
  \mathbf{q}=a+b\mathscr{i}+c\mathscr{j}+d\mathscr{k}
  $$
  也可以写成向量形式$\mathbf{q}=[a\;b\;c\;d]$或$\mathbf{q}=[a\;\vec{v}]$

- 加减法：实部和三个虚部分别运算

- 乘法：三个虚数单位的乘法关系为：
  $$
  \begin{aligned}
  \mathscr{i}\mathscr{j} &= \mathscr{k} \\
  \mathscr{j}\mathscr{k} &= \mathscr{i} \\
  \mathscr{k}\mathscr{i} &= \mathscr{j} \\
  \mathscr{x}\mathscr{y} &= -\mathscr{y}\mathscr{x} , \quad \mathscr{x}, \mathscr{y} \in \{\mathscr{i},\mathscr{j},\mathscr{k}\}\\
  \end{aligned}
  $$
  根据分配律和结合律可以写出乘法公式，但是那样太复杂了，比较简单的形式被称为Graßmann积:
  $$
  [s, \vec{u}][t, \vec{v}] = [st-\vec{u}\cdot\vec{v}, s\vec{v}+t\vec{u}+\vec{u}\times\vec{v}]
  $$

- 纯四元数：实部为0的四元数称为纯四元数。性质：

  - $[0, \vec{u}][0, \vec{v}] = [-\vec{u}\cdot\vec{v}, \vec{u}\times\vec{v}]$

- 模：$||[a\;b\;c\;d]||=\sqrt{a^2+b^2+c^2+d^2}$
- 共轭：$\mathbf{q}^*=[s,-\vec{v}]$，$\mathbf{q}\mathbf{q}^*=\mathbf{q}^*\mathbf{q}=||\mathbf{q}||^2$，$\mathbf{q}_1^*\mathbf{q}_2^*=(\mathbf{q}_2\mathbf{q}_1)^*$
- 逆：$\mathbf{q}^{-1}=\mathbf{q}^*/ ||\mathbf{q}||$，特殊地对于描述旋转的单位四元数，逆和共轭相等

## 四元数描述旋转

**3D旋转公式**：向量$\vec{v}$绕旋转轴$\vec{u}$旋转$\theta$角之后的向量$\vec{v}'$可以使用四元数乘法计算。令$\mathbf{v}=[0,\vec{v}]$，$\mathbf{q}=[\cos(\theta/2), \sin(\theta/2)\vec{u}]$，则
$$
\mathbf{v}'=\mathbf{q}\mathbf{v}\mathbf{q}^*=\mathbf{q}\mathbf{v}\mathbf{q}^{-1}
$$
$\mathbf{q}\mathbf{v}\mathbf{q}^*$这个变换对$\mathbf{v}$平行于旋转轴的分量实施的变换是$\mathbf{q}\mathbf{q}^*$（无旋转），而正交于旋转轴的分量实施的变换是$\mathbf{q}^2$（旋转$\theta/2+\theta/2$）。

## 四元数和旋转矩阵互相转化

### 四元数到旋转矩阵

对于一个单位四元数$\mathbf{q}=[a,\vec{v}]$ ，可以提取它对应的旋转角度和旋转轴：
$$
\theta=2\arccos(a)
$$

$$
\vec{k}=\frac{\vec{v}}{\sin(\theta/2)}
$$

再根据前面旋转的转轴-角度表示一节的公式可以得到：
$$
R=\left[\begin{matrix}
1-2c^2-2d^2 & 2bc-2ad & 2ac+2bd \\
2bc+2ad & 1-2b^2-2d^2 & 2cd-2ab \\
2bd-2ac & 2ab+2cd & 1-2b^2-2c^2
\end{matrix}\right]
$$

### 旋转矩阵到四元数

#### 算法一

$$
\begin{aligned}
a &= \frac{1}{2}\sqrt{\mathrm{tr}(R)+1} \\
b &= \frac{r_{32}-r_{23}}{4a} \\
c &= \frac{r_{13}-r_{31}}{4a} \\
d &= \frac{r_{21}-r_{12}}{4a} \\
\end{aligned}
$$

但是当$a\simeq 0$时容易出现数值不稳定（除零）

#### 算法二

在算法一基础上分类以避免数值不稳定，核心就是让作为分母的那一项比较大

- 当$\mathrm{tr}(R)>0$

  同算法一

- 当$r_{11}>r_{22}+r_{33}$
  $$
  \begin{aligned}
  a &= \frac{r_{32}-r_{23}}{4b} \\
  b &= \frac{1}{2}\sqrt{1+r_{11}-r_{22}-r_{33}} \\
  c &= \frac{r_{12}+r_{21}}{4b} \\
  d &= \frac{r_{13}+r_{31}}{4b} \\
  \end{aligned}
  $$

- 当$r_{22}>r_{11}+r_{33}$
  $$
  \begin{aligned}
  a &= \frac{r_{13}-r_{31}}{4c} \\
  b &= \frac{r_{12}+r_{21}}{4c} \\
  c &= \frac{1}{2}\sqrt{1+r_{22}-r_{11}-r_{33}} \\
  d &= \frac{r_{23}+r_{32}}{4c} \\
  \end{aligned}
  $$

- 当$r_{33}>r_{11}+r_{22}$
  $$
  \begin{aligned}
  a &= \frac{r_{21}-r_{12}}{4d} \\
  b &= \frac{r_{13}+r_{31}}{4d} \\
  c &= \frac{r_{23}+r_{32}}{4d} \\
  d &= \frac{1}{2}\sqrt{1+r_{33}-r_{11}-r_{22}} \\
  \end{aligned}
  $$
  

#### 算法三

来自[^1]，首先将旋转矩阵转化成$K_3$矩阵：
$$
K_3=\frac{1}{3}\left[\begin{matrix}
r_{11}-r_{22}-r_{33} & r_{21}+r_{12} & r_{31}+r_{13} & r_{23}-r_{32} \\
r_{21}+r_{12} & r_{22}-r_{11}-r_{33} & r_{32}+r_{23} & r_{31}-r_{13} \\
r_{31}+r_{13} & r_{32}+r_{23} & r_{33}-r_{11}-r_{22} & r_{12}-r_{21} \\
r_{23}-r_{32} & r_{31}-r_{13} & r_{12}-r_{21} & r_{11}+r_{22}+r_{33} \\
\end{matrix}\right]
$$
这个矩阵只有一个特征向量$\vec{q}=[b,c,d,a]^T$，特征值为1.

## 旋转的叠加（四元数版）

和旋转矩阵其实一样，当绕固定坐标系旋转时（或者理解为旋转刚体，坐标系不动），复合旋转的四元数是每个旋转的依次**左乘**：
$$
\mathbf{v}''=\mathbf{q}_2\mathbf{v}'\mathbf{q}_2^*=(\mathbf{q}_2\mathbf{q}_1)\mathbf{v}(\mathbf{q}_2\mathbf{q}_1)^*
$$
而当绕随动坐标系旋转时（或者理解为旋转坐标系，刚体不动），复合旋转的四元数是每个旋转依次**右乘**。

## 用四元数实现坐标变换

### 点/向量

若坐标系B相对于坐标系A的旋转为$\mathbf{q}^A_B$，平移为$\mathbf{T}_B^A$（三维向量都用前面所述的方式转化为纯四元数表示），则点$P$在两个坐标系下的坐标关系为：
$$
\mathbf{p}^A=\mathbf{q}^A_B\mathbf{p}^B(\mathbf{q}^A_B)^*+\mathbf{T}^A_B
$$
旋转的部分可以这样理解：点不动旋转坐标系，坐标数值上其实相当于坐标系不动反向旋转点，也就是说
$$
\mathbf{p}^B=(\mathbf{q}^A_B)^*\mathbf{p}^A\mathbf{q}^A_B \quad\text{(rotation only)}
$$
这个结果其实和旋转矩阵很类似。

### 旋转

对于用四元数表示的一个旋转$r$，在不同坐标系下表示它的四元数关系为：
$$
\mathbf{q}^A_r=(\pm)(\mathbf{q}^A_B)^*\mathbf{q}^A_r\mathbf{q}^A_B
$$
这和旋转矩阵在形式上一致。

## 四元数的指数形式与幂运算

类似欧拉公式，对于单位向量$\vec{u}$，有
$$
\mathrm{e}^{\vec{u}\theta}=\cos\theta+\vec{u}\sin\theta
$$
由此可以得到四元数的幂运算：
$$
\mathbf{q}^t=\mathrm{e}^{\vec{u}(t\theta)}
$$
 即相当于将其旋转角度乘$t$，旋转轴不变。

## 四元数的插值

四元数相比其他旋转表示方法的优点之一就是其插值较为容易。

### 旋转变化量

要计算两个旋转之间的变化量很简单：
$$
\Delta\mathbf{q}=\mathbf{q}_1\mathbf{q}_0^*
$$
如果将四元数看作四维空间的向量，那么$\mathbf{q}_0\cdot\mathbf{q}_1$就是这个四维空间中两个向量夹角的余弦值，这个夹角正是三维空间中该旋转变化量角度的一半。  

### Lerp

即线性插值（Linear Interpolation），将两个四元数看作四维空间的两个向量，Lerp就是通过线性方式插值两个向量：
$$
\mathbf{q}_t=\mathrm{Lerp}(\mathbf{q}_0,\mathbf{q}_1,t)\triangleq(1-t)\mathbf{q}_0+t\mathbf{q}_1
$$
 显然，这样插值出的向量终点在弦上，因此并不是单位四元数。

### Nlerp

对Lerp的结果归一化为单位四元数就得到了正规化线性插值（Normalized Linear Interpolation）：
$$
\mathbf{q}_t=\mathrm{Nlerp}(\mathbf{q}_0,\mathbf{q}_1,t)\triangleq \frac{(1-t)\mathbf{q}_0+t\mathbf{q}_1}{||(1-t)\mathbf{q}_0+t\mathbf{q}_1||}
$$
Nlerp在需要插值的角度较大时，角速度会显著变化，在$t=0.5$附近角速度最大，而在两端角速度较小。

### Slerp

球面线性插值（Spherical Linear Interpolation）不是对向量插值而是对角度插值，因此它对角度是均匀的。根据四元数的幂定义可以很容易写出一个版本：
$$
\mathbf{q}_t=\mathrm{Slerp}(\mathbf{q}_0,\mathbf{q}_1,t)=(\mathbf{q}_1\mathbf{q}_0^*)^t\mathbf{q}_0
$$
 可见当$t=0$时为$\mathbf{q}_0$，当$t=1$时为$\mathbf{q}_1$。但是这个公式中含有多次四元数乘法和幂运算，实际计算的效率很低。更高效的方法是：
$$
\theta=\arccos(\mathbf{q}_0\cdot\mathbf{q}_1)
$$

$$
\mathbf{q}_t=\mathrm{Slerp}(\mathbf{q}_0,\mathbf{q}_1,t)=\frac{\sin((1-t)\theta)}{\sin\theta}\mathbf{q}_0+\frac{\sin(t\theta)}{\sin\theta}\mathbf{q}_1
$$

实际应用中，当夹角很小时$\sin\theta$接近于0，就必须改用Nlerp来插值。

### 双倍覆盖

由于$\mathbf{q}$和$-\mathbf{q}$表示了相同的旋转，因此四元数空间其实是双倍覆盖了$SO(3)$空间。而插值时对$\mathbf{q}$还是$-\mathbf{q}$进行插值，旋转的变化量是不同的。因此需要判断$\mathbf{q}_0\cdot\mathbf{q}_1$是否为负数，如果是负数说明两个四元数在四维空间中的夹角是钝角，需要将其中一个四元数取反来得到最短的插值路径。

### Squad

为了解决Slerp插值只实现$C^0$连续，在轨迹点存在角速度突变的问题，以牺牲固定角速度为条件实现轨迹的$C^1$连续，即角速度连续。Squad指Spherical and quadrangle，球面四边形插值，核心思想是利用Slerp来构建三次贝塞尔曲线。构造贝塞尔曲线有一个著名的递归算法de Casteljau算法，但是它的计算太复杂，对于三次贝塞尔曲线，它是三层一次插值的嵌套：
$$
\mathrm{Bezier}(\vec{v}_0,\vec{v}_1,\vec{v}_2,\vec{v}_3;t)=L(L(L(\vec{v}_0),\vec{v}_1;t),L(\vec{v}_1,\vec{v}_2;t);t),L(L(\vec{v}_1,\vec{v}_2;t),L(\vec{v}_2,\vec{v}_3;t);t);t)
$$
其中$L$是Lerp线性插值；对于四元数来说要换成Slerp插值。

而Quad使用一个二次插值和一个一次插值的嵌套来近似它：
$$
\mathrm{Bezier}(\vec{v}_0,\vec{v}_1,\vec{v}_2,\vec{v}_3;t)=L(L(\vec{v}_0,\vec{v}_3;t),L(\vec{v}_1,\vec{v}_2;t);2t(1-t))
$$
将Lerp换成Slerp就得到Squad插值：
$$
Squad(\mathbf{q}_0,\mathbf{q}_1,\mathbf{q}_2,\mathbf{q}_3;t)=S(S(\mathbf{q}_0,\mathbf{q}_3;t),S(\mathbf{q}_1,\mathbf{q}_2;t);2t(1-t))
$$
对于四元数序列$\mathbf{q}_0,\mathbf{q}_1,\dots,\mathbf{q}_n$，对每一对四元数$\mathbf{q}_i,\mathbf{q}_{i+1}$都进行插值$Squad(\mathbf{q}_i,\mathbf{s}_i,\mathbf{s}_{i+1},\mathbf{q}_{i+1};t)$，其中控制点$\mathbf{s}_i,\mathbf{s}_{i+1}$的选择使得切换点处可导，这里给出结果：
$$
\mathbf{s}_i=\mathbf{q}_i\exp\left(-\frac{\log(\mathbf{q}_i^*\mathbf{q}_{i-1})+\log(\mathbf{q}_i^*\mathbf{q}_{i+1})}{4}\right)
$$

## Reference

[^1]: https://doi.org/10.2514/2.4654
