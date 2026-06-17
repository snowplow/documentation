const flatMap = require('unist-util-flatmap')

const plugin = () => {
  const config = {
    AAID: 'Android Advertising ID',
    ADLS: 'Azure Data Lake Storage',
    AWS: 'Amazon Web Services',
    CDI: 'Customer Data Infrastructure',
    CDN: 'Content Delivery Network',
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
    PII: 'Personally Identifiable Information',
    PMC: 'Private Managed Cloud',
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
                  type: 'html',
                  value: `<abbr data-title="${config[token]}" class="relative cursor-help underline decoration-dotted hover:after:content-[attr(data-title)] focus:after:content-[attr(data-title)] hover:after:absolute focus:after:absolute hover:after:z-50 focus:after:z-50 hover:after:bg-popover focus:after:bg-popover hover:after:text-popover-foreground focus:after:text-popover-foreground hover:after:text-sm focus:after:text-sm hover:after:px-2 focus:after:px-2 hover:after:py-1 focus:after:py-1 hover:after:rounded focus:after:rounded hover:after:whitespace-nowrap focus:after:whitespace-nowrap hover:after:left-1/2 focus:after:left-1/2 hover:after:-translate-x-1/2 focus:after:-translate-x-1/2 hover:after:top-full focus:after:top-full hover:after:mt-1 focus:after:mt-1">${token}</abbr>`,
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
