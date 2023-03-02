const flatMap = require('unist-util-flatmap')

const plugin = () => {
  const config = {
    'AWS': 'Amazon Web Services',
    'BDP': 'Behavioral Data Platform',
    'CDP': 'Customer Data Platform',
    'EC2': 'Amazon Elastic Compute Cloud',
    'ECS': 'Amazon Elastic Container Service',
    'ETL': 'Extract, Transform, Load',
    'GCP': 'Google Cloud Platform',
    'GCS': 'Google Cloud Storage',
    'GTM': 'Google Tag Manager',
    'OSS': 'Open Source Software',
    'QA': 'Quality Assurance',
    'RDS': 'Amazon Relational Database Service',
    'S3': 'Amazon Cloud Object Storage',
    'SS': 'Server Side',
    'UA': 'User Agent',
    'VPC': 'Virtual Private Cloud',
  }
  const transformer = async (ast) => {
    const find = new RegExp('(' + Object.keys(config).map(abbr => `(?<![A-Z])${abbr}(?![A-Z])`).join('|') + ')')
    flatMap(ast, node => {
      if (node.type === 'text') {
        const split = node.value.split(find)
        if (split.length > 1) {
          const replaced = split.map(token => config[token] ?
            { type: 'html', value: `<abbr title="${config[token]}">${token}</abbr>` } :
            { ...node, value: token }
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
