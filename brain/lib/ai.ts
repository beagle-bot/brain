export function hasOpenAIKey() {
  return Boolean(process.env.OPENAI_API_KEY);
}

export const aiFallbackNote =
  "v0.1 当前默认使用本地 mock AI 逻辑。配置 OPENAI_API_KEY 后，可以在后续迭代中把 scoring、memory 和 output 生成迁移到真实模型调用。";
