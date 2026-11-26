# Academia Esparta – Web + Asistente virtual (React + Express + Azure AI Foundry)

Un solo servicio: Express sirve el frontend compilado (`dist/`) y expone `/api/chat`,
que llama a tu agente `Agente-Academia-Esparta` en Azure AI Foundry.

## 1. Probar en tu PC
```bash
az login                 # ya lo hiciste; elige la suscripción Azure for Students
npm install
npm run dev              # web en http://localhost:5173  (API en :3000)
```
Producción local: `npm run build && npm start` → http://localhost:3000

## 2. Variables (.env / App Settings)
- `AZURE_AI_PROJECT_ENDPOINT` = https://academiaespartaandia.services.ai.azure.com/api/projects/GrupoAndia-proj
- `AZURE_AI_AGENT_NAME` = Agente-Academia-Esparta

## 3. Desplegar en Azure App Service
```bash
az webapp up --name esparta-web --runtime "NODE:20-lts" --sku B1 --location eastus2
az webapp config appsettings set --name esparta-web --resource-group <TU_GRUPO> --settings \
  AZURE_AI_PROJECT_ENDPOINT="https://academiaespartaandia.services.ai.azure.com/api/projects/GrupoAndia-proj" \
  AZURE_AI_AGENT_NAME="Agente-Academia-Esparta" SCM_DO_BUILD_DURING_DEPLOYMENT=true
```
(`az webapp up` imprime el nombre del grupo de recursos; si el plan F1 está disponible úsalo en lugar de B1.)

## 4. Permisos (paso clave)
En producción no hay `az login`; se usa Identidad administrada:
1. App Service → Identidad → Asignada por el sistema → **Activar**.
2. Foundry/recurso de IA (academiaespartaandia) → Control de acceso (IAM) → Agregar asignación de rol
   → **Azure AI User** → miembro: la identidad administrada de `esparta-web`.

## 5. Contenido
Edita textos, programas y contacto en `src/App.jsx`. Colores en `src/styles.css` (`:root`).
Las reglas del agente (solo responder con su base de conocimiento) se configuran en Foundry, no aquí.
