# CreateReservation

Creates new reservation.
### Input

| Name          | Type          | Required |
| ------------- |:-------------:| --------:|
| from          | Date          | Required |
| to            | Date          | Required |
| userId        | String        | Required |

_userId_ will be removed in further milestones.

### Output

| Name          | Type          | Required |
| ------------- |:-------------:| --------:|
| success       | boolean       | Required |
| error         | string        | Optional |


# ChangeReservation

Changes reservation.
### Input

| Name          | Type          | Required |
| ------------- |:-------------:| --------:|
| from          | Date          | Optional |
| to            | Date          | Optional |
| reservationId | String        | Required |
| userId        | String        | Required |

_userId_ will be removed in further milestones.

### Output

| Name          | Type          | Required |
| ------------- |:-------------:| --------:|
| success       | boolean       | Required |
| error         | string        | Optional |


# DeleteReservation

Deletes reservation.
### Input

| Name          | Type          | Required |
| ------------- |:-------------:| --------:|
| reservationId | String        | Required |
| userId        | String        | Required |

_userId_ will be removed in further milestones.

### Output

| Name          | Type          | Required |
| ------------- |:-------------:| --------:|
| success       | boolean       | Required |
| error         | string        | Optional |

