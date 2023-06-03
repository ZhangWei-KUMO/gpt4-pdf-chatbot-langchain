# 基于PDF文件构建GPT机器人
使用新的 GPT-4 API 构建一个 ChatGPT 聊天机器人，用于多个大型 PDF 文件。所使用的技术栈包括 LangChain、Pinecone、TypeScript、OpenAI 和 Next.js。LangChain 是一个框架，可以更轻松地构建可扩展的 AI/LLM 应用程序和聊天机器人。Pinecone 是一个用于存储嵌入向量和将 PDF 转换为文本以便后续检索相似文档的矢量存储库。

> 请确保您已经在系统上下载了 Node，并且版本是 18 或更高。

## 开发

1. 克隆存储库或下载 ZIP

```
git clone [github https url]
```

2. 安装包

首先运行 `npm install yarn -g` 以全局安装 Yarn（如果尚未安装）。

然后运行：

```
yarn install
```

3. 设置 `.env` 文件

- 创建`.env` 文件

```
OPENAI_API_KEY=
PINECONE_API_KEY=
PINECONE_ENVIRONMENT=
PINECONE_INDEX_NAME=
```

- 访问 OpenAI 获取 API 密钥并插入到您的 `.env` 文件中。
- 访问 Pinecone 创建和检索 API 密钥，并从仪表板中检索您的环境和索引名称。
在 `config` 文件夹中，将 `PINECONE_NAME_SPACE` 替换为您想要在 Pinecone 上存储嵌入式向量的命名空间，当您运行 `npm run ingest` 时。稍后将使用此命名空间进行查询和检索。

在 `utils/makechain.ts` 中更改 `QA_PROMPT` 以适应您自己的用例。如果您有访问 `gpt-4 api`，请将 new OpenAI 中的 `modelName` 更改为 gpt-4。请在本仓库之外验证您是否有访问 `gpt-4` api，否则该应用程序将无法工作。

## 将您的PDF文件转换为嵌入向量
### 此存储库可以加载多个 PDF 文件

在 docs 文件夹中添加您的 PDF 文件或包含 PDF 文件的文件夹。
运行脚本 `npm run ingest` 对您的PDF文件进行向量化存储。

## 运行应用程序
一旦您确认嵌入向量和内容已成功添加到 Pinecone，您可以运行应用程序 `npm run dev` 来启动本地开发环境，然后在聊天界面中输入问题。

**常见错误**

- 确保您正在运行最新的 Node 版本。运行 `node -v` 命令。
- 尝试使用不同的 PDF 文件或将您的 PDF 文件先转换为文本格式。有可能您的 PDF 文件已损坏、是扫描版或需要 OCR 转换为文本格式。
- 使用 `console.log` 打印出 `env` 变量，并确保它们被公开。
- 确保您正在使用与此存储库相同版本的 LangChain 和 Pinecone。
- 检查是否已创建包含有效（且可用）API 密钥、环境和索引名称的 `.env` 文件。
- 如果您在 `OpenAI` 中更改了 `modelName`，请确保您已经获取了适当模型的 API 权限。
- 确保您拥有足够的 OpenAI 学分和一个有效的账单支付方式。
- 检查您的全局环境中是否有多个 OPENAPI 密钥。如果有，则项目中的本地 `env` 文件将被系统的 `env` 变量覆盖。
- 如果仍然存在问题，请尝试将您的 API 密钥硬编码到 `process.env` 变量中。

**Pinecone errors**

- 确保您的 Pinecone 仪表板 `environment` 和 `index` 与 `pinecone.ts` 和 `.env` 文件中的匹配。
- 检查您是否将向量维度设置为 `1536`。
- 确保您的 Pinecone 命名空间为小写。
- 在 Starter（免费）计划中，用户的 Pinecone 索引会在 7 天不活动后被删除。要防止这种情况，请在 7 天之前向 Pinecone 发送 API 请求以重置计数器。
- 使用新的 Pinecone 项目、索引和克隆的存储库从头开始重试。
