const flatMap = require('unist-util-flatmap')

const plugin = () => {
  const config = {
    AAID: 'Android Advertising ID',
    AWS: 'Amazon Web Services',
    BDP: 'Behavioral Data Platform',
    CDP: 'Customer Data Platform',
    CLI: 'Command Line Interface',
    EC2: 'Amazon Elastic Compute Cloud',
    ECS: 'Amazon Elastic Container Service',
    ETL: 'Extract, Transform, Load',
    GCP: 'Google Cloud Platform',
    GCS: 'Google Cloud Storage',
    GTM: 'Google Tag Manager',
    HAR: 'HTTP Archive',
    IAB: 'Interactive Advertising Bureau',
    IDFA: 'Identifier for Advertisers',
    IDFV: 'Identifier for Vendors',
    KCL: 'Kinesis Client Library',
    OSS: 'Open Source Software',
    QA: 'Quality Assurance',
    RDS: 'Amazon Relational Database Service',
    S3: 'Amazon Cloud Object Storage',
    SS: 'Server Side',
    SQS: 'Amazon Simple Queue Service',
    UA: 'User Agent',
    VPC: 'Virtual Private Cloud',
    YAUAA: 'Yet Another UserAgent Analyzer',
  }
  const transformer = async (ast) => {
    const find = new RegExp(
      '(' +
        Object.keys(config)
          .map((abbr) => `(?<![A-Z])${abbr}(?![A-Z])`)
          .join('|') +
        ')'
    )
    flatMap(ast, (node) => {
      if (node.type === 'text') {
        const split = node.value.split(find)
        if (split.length > 1) {
          const replaced = split.map((token) =>
            config[token]
              ? {
                  type: 'html',
                  value: `<abbr data-title="${config[token]}">${token}</abbr>`,
                }
              : { ...node, value: token }
          )
          return replaced
        }
      }
      return [node]
    })
  }
  return transformer
}

module.exports = plugin
