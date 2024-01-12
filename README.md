
# Collision-with-ThreeJS

Esse é um projeto que sem dúvida agrega bastante nos meus estudos com ThreeJS. Pois nele aprendi a utilizar a lib cannon-es, responsável pelas colisões.

Dessa vez continuando a saga de vídeo do canal [WaelYasmina](https://www.youtube.com/channel/UC1q2FdkcQ4qIxXzj3KQ1HYA).

Vi um [vídeo](https://www.youtube.com/watch?v=TPKWohwHrbo) sobre a utilização da lib.
## Aprendizados

- Entender o CANNON.World();
- Entender o CANNON.Body();
- Entender o CANNON.Material() e o CANNON.ContactMaterial()
- Entender linearDamping 
- Entender angularVelocity

## Uso/Exemplos

### CANNON.World

O CANNON.World, como o próprio nome já sugere, é o mundo, ou seja recebe as algumas condições como a gravidade.

```js
const world = new CANNON.World({
    gravity: new CANNON.Vec3(0, -9.81, 0),
})
```

Todos os CANNON.Body (que seram explicados abaixo) são adicionados no world, a partir do método:

```js
world.addBody()
```

### CANNON.Body

O body é como se fosse o corpo "físico" dos objetos representados.

Ou seja, quando criamos um objeto usando o Three.JS, utilizamos:

- Three.Mesh(tipo)Material (para adicionar uma textura ao objeto)
- Three.(Nome do objeto)Geometry (para dar a forma do objeto).

E agora, para dar a física usaremos o
- CANNON.Body.

Deixo abaixo um exemplo:
```js
const boxBody = new CANNON.Body({
    mass: 1,
    shape: new CANNON.Box(new CANNON.Vec3(1, 1, 1)),
    position: new CANNON.Vec3(0, 20, 0),
    material: boxPhysMat
});
```

Como visto acima ele recebe os atributos: 
- mass (massa, se for 0 o objeto não é afetado pela gravidade);
- shape (é o mesmo princípio do Three.(Nome do objeto)Geometry, porém utilizando o CANNON.(Nome do Objeto));
- position (posição do objeto);
- material (explicado com calma na parte do ContactMaterial).

Após isso o adicionamos ao World
```js
world.addBody(boxBody)
```

### CANNON.ContactMaterial

O CANNON.ContactMaterial é bem diferente do Three.Mesh(tipo)Material do ThreeJS, já que o "Material" do ThreeJS é basicamente a textura, já o do Cannon é basicamente as propriedades físicas dele e como ele se relaciona com outros objetos.

#### Exemplo:

- Box
```js
const boxPhysMat = new CANNON.Material()

const boxBody = new CANNON.Body({
    mass: 1,
    shape: new CANNON.Box(new CANNON.Vec3(1, 1, 1)),
    position: new CANNON.Vec3(0, 20, 0),
    material: boxPhysMat
});
```

- Ground
```js
const groundPhysMat = new CANNON.Material()

const groundBody = new CANNON.Body({
    //shape: new CANNON.Plane(),
    //mass: 10
    shape: new CANNON.Box(new CANNON.Vec3(15, 15, 0.1)),
    type: CANNON.Body.STATIC,
    material: groundPhysMat,
});
```

Como observado acima, ambas as formas recebem um CANNON.Material

```js
const groundBoxContactMat = new CANNON.ContactMaterial(
    groundPhysMat,
    boxPhysMat,
    {friction: 0.04}
);
```

No exemplo acima, eu passo 3 parâmetros:
- CANNON.Material do objeto 1(groundPhysMat);
- CANNON.Materil do objeto 2(boxPhysMat);
- Por fim, um objeto de algumas opções para definir como vai ser essa interação, no caso defini o atrito para 0.04.

O resultado disso faz com que, no impacto entre a box e o ground a box deslize um pouco.

### Conceitos Interessantes

#### LinearDamping

Se resume a resistência do ar, sem ela um objeto como uma esfera após impactar em outro objeto se movimentaria para sempre, com a resistência do ar, o movimento ir terminar de acordo com a intensidade dela.

Exemplo:
```js
sphereBody.linearDamping = 0.31
```

Nesse exemplo defini a resistência do ar em relação a sphere, que faz com que depois de alguns segundos de um impacto ela estacione.

#### LinearDamping

Se resume a algo parecido com rotation do ThreeJS.

Exemplo:
```js
boxBody.angularVelocity.set(0,5,0)
```

No exemplo acima, enquanto a box não encostar em nada, ela ir ficar girando em seu eixo Y
## Teste você mesmo!

[Confira!](https://collision-with-three-js-by-dev-victor-lis.vercel.app/)

## Autores

- [@Victor-Lis](https://github.com/Victor-Lis)

