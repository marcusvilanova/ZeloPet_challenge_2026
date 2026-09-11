# Zelo Mobile

Aplicativo nativo em React Native + Expo para o projeto Zelo. A interface foi adaptada das páginas Thymeleaf existentes no backend Java, mantendo a linguagem visual de cuidado contínuo, cards, alertas e triagens.

## Stack

- Expo SDK 54, React Native 0.81 e TypeScript;
- Expo Router para rotas explícitas e proteção de áreas autenticadas;
- TanStack Query para consultas e mutações HTTP;
- SecureStore no iOS/Android e AsyncStorage no web de preview;
- API REST do backend Spring Boot Java com Bearer token;
- Oracle/H2 continuam sendo acessados exclusivamente pela API Java.

## Executar

```bash
npm install
npm start
```

Use `http://localhost:8080` no navegador e no simulador iOS. No emulador Android, use `http://10.0.2.2:8080`. Para um celular físico, substitua `localhost` pelo IP da máquina que executa o Spring Boot, por exemplo `http://192.168.0.10:8080`; o computador e o celular precisam estar na mesma rede. A API Java não precisa ser publicada.

No Windows PowerShell, se precisar alterar o endereço da API antes de iniciar:

```powershell
$env:EXPO_PUBLIC_API_BASE_URL="http://localhost:8080"
npm start
```

`npm start` inicia o Expo. Depois, pressione `w` para abrir no navegador, `a` para Android ou leia o QR Code com o Expo Go. O comando `npm run dev` também inicia o preview web diretamente. O script `npm run start:api` é reservado para o servidor Node auxiliar do template e não substitui o backend Java.

## Fluxos implementados

- Login real e cadastro de tutor;
- Persistência de sessão e logout;
- Proteção de rotas autenticadas;
- Dashboard com dados reais de pets, alertas e triagens;
- CRUD de pets;
- Criação, consulta, cancelamento e exclusão de triagens;
- Criação, consulta, confirmação, cancelamento e exclusão de alertas;
- Perfil e exibição do tipo de acesso TUTOR, VETERINARIO ou GESTOR.

## Tratamento de erros

O cadastro valida os campos localmente e informa o campo que precisa de correção. A API Java retorna JSON para validações, e-mail já cadastrado, credenciais inválidas, falhas de permissão e indisponibilidade do servidor. Quando o celular não consegue alcançar o backend, o app orienta verificar se o Spring Boot está ligado e se `EXPO_PUBLIC_API_BASE_URL` aponta para o IP correto da máquina.

## Endpoints esperados

| Método | Endpoint | Acesso |
|---|---|---|
| POST | `/api/auth/login` | Público |
| POST | `/api/auth/register` | Público, cria TUTOR |
| GET | `/api/auth/me` | Bearer |
| GET/POST/PUT/DELETE | `/api/pets` e `/api/pets/{id}` | TUTOR |
| GET/POST/PATCH/DELETE | `/api/triagens` | TUTOR |
| GET/POST/PATCH/DELETE | `/api/alertas` | TUTOR |
| GET | `/api/clinicas` | Bearer |
| GET/PUT | `/api/clinicas/minha` e `/api/clinicas/{id}` | GESTOR |

O cliente envia `Authorization: Bearer <token>` após o login. O backend Java adicionado ao projeto `zelo-java` implementa esses contratos reaproveitando `PetService`, `TriagemService`, `AlertaService` e `AuthService`.

Se o Windows mostrar `Cannot find module 'babel-preset-expo'`, atualize o projeto e refaça a instalação:

```powershell
Remove-Item -Recurse -Force node_modules
Remove-Item -Force package-lock.json -ErrorAction SilentlyContinue
npm install
npm start
```

O pacote `babel-preset-expo` já está declarado no projeto e o `.npmrc` usa apenas `legacy-peer-deps=true`, necessário para o npm resolver as dependências deste template sem o aviso de `node-linker` do pnpm.

## Contas de demonstração do Java

As contas seed existentes no backend continuam válidas. Use as credenciais documentadas no README do projeto Java e nunca coloque senhas reais no código mobile.

## Validações

```bash
npm run check
npm run lint
npm test
```
