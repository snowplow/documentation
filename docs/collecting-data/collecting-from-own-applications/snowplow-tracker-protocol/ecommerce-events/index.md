---
title: "E-commerce events"
---

<details>
  <summary>Old e-commerce events</summary>
  <div>

#### Transaction tracking

Transaction events allow you to track a transaction. The items of the transaction can be tracked using [Transaction Item events](#transaction-item-events).

| **Parameter** | **Table Column**      | **Type** | **Description**                                      | **Example values** |
|----------------|----------|------------------------------------------------------|--------------------|
| `tr_id`       | `tr_orderid`     | text     | Order ID                                             | `12345`            |
| `tr_af`       | `tr_affiliation` | text     | Transaction affiliation (e.g. channel)               | `Web`              |
| `tr_tt`       | `tr_total`       | decimal  | Transaction total value                              | `9.99`             |
| `tr_tx`       | `tr_tax`         | decimal  | Transaction tax value (i.e. amount of VAT included)  | `1.98`             |
| `tr_sh`       | `tr_shipping`    | decimal  | Delivery cost charged                                | `3.00`             |
| `tr_ci`       | `tr_city`        | text     | Delivery address: city                               | `London`           |
| `tr_st`       | `tr_state`       | text     | Delivery address: state                              | `Denver`           |
| `tr_co`       | `tr_country`     | text     | Delivery address: country                            | `United Kingdom`   |
| `tr_cu`       | `tr_currency`    | text     | Transaction Currency                                 | `GBP`              |

#### Transaction item events

Transaction item events are separate events, representing the items of a transaction, which are linked to a Transaction event via `ti_id` which should map to `tr_id` of a transaction event.

| **Parameter** | **Table Column**  | **Type** | **Description**  | **Example values** |
|---------------|---------------|----------|------------------|--------------------|
| `ti_id`       | `ti_orderid`  | text     | Order ID         | `12345`            |
| `ti_sk`       | `ti_sku`      | text | Item SKU | Yes | \`pbz0025' |
| `ti_nm`       | `ti_name`     | text | Item name | Yes | `black-tarot` |
| `ti_ca`       | `ti_category` | text | Item category | Yes | `tarot` |
| `ti_pr`       | `ti_price`    | decimal | Item price | Yes | `7.99` |
| `ti_qu`       | `ti_quantity` | integer | Item quantity | Yes | `2` |
| `ti_cu`       | `ti_currency` | text | Currency | Yes | `USD` |

  </div>
</details>
