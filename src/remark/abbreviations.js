const flatMap = require('unist-util-flatmap')

const plugin = () => {
  const config = {
    AAID: 'Android Advertising ID',
    ADLS: 'Azure Data Lake Storage',
    AWS: 'Amazon Web Services',
    BDP: 'Behavioral Data Platform',
    CDI: 'Customer Data Infrastructure',
    CDP: 'Customer Data Platform',
    CLI: 'Command Line Interface',
    EC2: 'Amazon Elastic Compute Cloud',
    ECS: 'Amazon Elastic Container Service',
    ETL: 'Extract, Transform, Load',
    FAQ: 'Frequently Asked Questions',
    GCP: 'Google Cloud Platform',
    GCS: 'Google Cloud Storage',
    GTM: 'Google Tag Manager',
    HAR: 'HTTP Archive',
    IAB: 'Interactive Advertising Bureau',
    IDFA: 'Identifier for Advertisers',
    IDFV: 'Identifier for Vendors',
    ITP: 'Intelligent Tracking Prevention',
    KCL: 'Kinesis Client Library',
    OSS: 'Open Source Software',
    QA: 'Quality Assurance',
    PII: 'Personal Identifiable Information',
    RDS: 'Amazon Relational Database Service',
    S3: 'Amazon Cloud Object Storage',
    SS: 'Server Side',
    SQS: 'Amazon Simple Queue Service',
    UA: 'User Agent',
    VMSS: 'Azure Virtual Machine Scale Sets',
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
                  type: 'mdxJsxFlowElement',
                  name: 'abbr',
                  attributes: [
                    {
                      type: 'mdxJsxAttribute',
                      name: 'data-title',
                      value: config[token],
                    }
                  ],
                  children: [{type: 'text', value: token}]
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
