import { dbtVersions } from '@site/src/dbtVersions'
import { satisfies, gt, valid } from 'semver'
import React, { useState } from 'react'
import styles from './styles.module.css'

export default function DbtVersionChecker() {
  const [dbtVer, setDbtVer] = useState('')
  const [utilsVer, setutilsVer] = useState('')
  return (
    <>
      <div className={styles.versionChecker}>
        <form className="DocSearch-Form">
          <label className="DocSearch-MagnifierLabel" htmlFor="dbt">
            dbt:
          </label>
          <br />
          <input
            className="DocSearch-Input"
            placeholder="e.g. 1.3.0"
            maxLength="15"
            type="text"
            id="dbt"
            name="dbt"
            onChange={() => setDbtVer(event.target.value)}
          />
        </form>
        <form className="DocSearch-Form">
          <label className="DocSearch-MagnifierLabel" htmlFor="utils">
            dbt_utils:
          </label>
          <br />
          <input
            className="DocSearch-Input"
            placeholder="e.g. 1.0.0"
            maxLength="15"
            type="text"
            id="utils"
            name="utils"
            onChange={() => setutilsVer(event.target.value)}
          />
        </form>
      </div>
      <br />
      <GetSupportedPackages dbtVer={dbtVer} utilsVer={utilsVer} />
    </>
  )
}

const GetSupportedPackages = ({ dbtVer, utilsVer }) => {
  let packageVersions = []
  if (!valid(dbtVer)) {
    return <em>Please enter a valid dbt version.</em>
  }
  if (!valid(utilsVer) && utilsVer !== '') {
    return <em>Please enter a valid dbt_utils version.</em>
  }
  for (const [pkg, version] of Object.entries(dbtVersions)) {
    let maxVer = '0.0.0'
    let actualMaxVer = '0.0.0'
    for (const [ver, details] of Object.entries(version)) {
      // Check if the version is in the range the package supports, AND if the dbt-utils version is within the range (if exists) and check if this version is newer than our previous highest
      const dbtUtilsRequiredVersion =
        details.packages['dbt-labs/dbt_utils'] ?? utilsVer
      const satisfiesDbt = satisfies(dbtVer, details.dbtversion, {
        includePrerelease: true,
      })
      const satisfiesDbtUtils =
        utilsVer === '' ||
        satisfies(utilsVer, dbtUtilsRequiredVersion, {
          includePrerelease: true,
        })
      if (satisfiesDbt && satisfiesDbtUtils && gt(ver, maxVer)) {
        maxVer = ver
      }
      if (gt(ver, actualMaxVer)) {
        actualMaxVer = ver
      }
    }
    if (maxVer === '0.0.0') {
      packageVersions.push({ pkg, maxVer: null, actualMaxVer })
    } else {
      packageVersions.push({ pkg, maxVer, actualMaxVer })
    }
  }
  return (
    <>
      <p>
        For <strong>dbt</strong> version <code>{dbtVer}</code> and{' '}
        {utilsVer !== '' && (
          <>
            <strong>dbt_utils</strong> version <code>{utilsVer}</code>
          </>
        )}{' '}
        the latest version of each of our packages you can install are:
      </p>
      <table className={styles.supportedVersions}>
        <thead>
          <tr>
            <th>Package</th>
            <th>Max supported version</th>
            <th>Latest released version</th>
          </tr>
        </thead>
        <tbody>
          {packageVersions.map((x) => (
            <tr key={x.pkg}>
              <td>
                <a href={`https://hub.getdbt.com/${x.pkg}`}>{x.pkg}</a>
              </td>
              <td>
                {x.maxVer ? (
                  <code>
                    <a href={`https://hub.getdbt.com/${x.pkg}/${x.maxVer}`}>
                      {x.maxVer}
                    </a>
                  </code>
                ) : (
                  'No supported version'
                )}
              </td>
              <td>
                <em>
                  <code>
                    <a
                      href={`https://hub.getdbt.com/${x.pkg}/${x.actualMaxVer}`}
                    >
                      {x.actualMaxVer}
                    </a>
                  </code>
                </em>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}
