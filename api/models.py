from django.db import models
from django.contrib.auth.models import User
import string
import random

def generate_invite_code():
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))

class ExpenseGroup(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    invite_code = models.CharField(max_length=10, unique=True, default=generate_invite_code)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_groups')
    members = models.ManyToManyField(User, related_name='expense_groups')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['-created_at']

class Category(models.Model):
    name = models.CharField(max_length=50)
    icon = models.CharField(max_length=50, blank=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    is_default = models.BooleanField(default=False)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = 'Categories'

class Expense(models.Model):
    EXPENSE_TYPE_CHOICES = [
        ('income', 'Income'),
        ('expense', 'Expense'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='expenses')
    group = models.ForeignKey(ExpenseGroup, on_delete=models.CASCADE, null=True, blank=True, related_name='expenses')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True)
    description = models.TextField(blank=True, null=True)
    expense_type = models.CharField(max_length=10, choices=EXPENSE_TYPE_CHOICES, default='expense')
    date = models.DateField()
    receipt = models.ImageField(upload_to='receipts/', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.description} - {self.amount}"

    class Meta:
        ordering = ['-date', '-created_at']

class Budget(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='budgets')
    group = models.ForeignKey(ExpenseGroup, on_delete=models.CASCADE, null=True, blank=True, related_name='budgets')
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    period = models.CharField(max_length=20, choices=[('monthly', 'Monthly'), ('weekly', 'Weekly'), ('yearly', 'Yearly')])
    start_date = models.DateField()
    end_date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.category} - {self.amount}"