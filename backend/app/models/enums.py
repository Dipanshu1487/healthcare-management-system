"""Domain status and lifecycle constants for consistent column values."""


class RecordStatus:
    ACTIVE = "active"
    INACTIVE = "inactive"


class AppointmentStatus:
    SCHEDULED = "Scheduled"
    WAITING = "Waiting"
    IN_CONSULTATION = "In-Consultation"
    COMPLETED = "Completed"
    CANCELLED = "Cancelled"


class Priority:
    NORMAL = "Normal"
    URGENT = "Urgent"
    EMERGENCY = "Emergency"


class PrescriptionStatus:
    PENDING = "Pending"
    DISPENSED = "Dispensed"
    PARTIALLY_DISPENSED = "Partially Dispensed"
    CANCELLED = "Cancelled"


class LabOrderStatus:
    PENDING_COLLECTION = "Pending Collection"
    COLLECTED = "Collected"
    TESTING = "Testing"
    COMPLETED = "Completed"
    CANCELLED = "Cancelled"


class LabReportStatus:
    PENDING_REVIEW = "Pending Review"
    VERIFIED = "Verified"
    DELIVERED = "Delivered"


class BillStatus:
    PAID = "Paid"
    PENDING = "Pending"
    PARTIALLY_PAID = "Partially Paid"
    OVERDUE = "Overdue"


class InventoryStatus:
    OPTIMAL = "Optimal"
    LOW_STOCK = "Low Stock"
    EXPIRING_SOON = "Expiring Soon"
    OUT_OF_STOCK = "Out of Stock"


class InventoryTransactionType:
    DISPENSE = "Dispense"
    RESTOCK = "Restock"
    ADJUSTMENT = "Adjustment"
    RETURN = "Return"


class EmergencyTriage:
    CRITICAL = "Critical (Red)"
    SEVERE = "Severe (Yellow)"
    MODERATE = "Moderate (Green)"


class EmergencyStatus:
    ACTIVE = "Active"
    STABILIZED = "Stabilized"
    ADMITTED = "Admitted"
    DISCHARGED = "Discharged"


class NotificationType:
    INFO = "info"
    ALERT = "alert"
    SUCCESS = "success"
    WARNING = "warning"


class TimelineEventType:
    VISIT = "visit"
    LAB = "lab"
    MED = "med"
    SURGERY = "surgery"
    SCHEME = "scheme"
    REGISTRATION = "registration"
    EMERGENCY = "emergency"


class VaccinationStatus:
    COMPLETED = "Completed"
    SCHEDULED = "Scheduled"
    OVERDUE = "Overdue"


class DeviceStatus:
    ONLINE = "Online"
    OFFLINE = "Offline"
    MAINTENANCE = "Maintenance"


class SupplierDeliveryStatus:
    SCHEDULED = "Scheduled"
    IN_TRANSIT = "In Transit"
    DELIVERED = "Delivered"
