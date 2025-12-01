from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Expense, ExpenseGroup, Category, Budget

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'password')

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            password=validated_data['password']
        )
        return user

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class ExpenseSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.username', read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)
    group_name = serializers.CharField(source='group.name', read_only=True, allow_null=True)

    class Meta:
        model = Expense
        fields = '__all__'
        read_only_fields = ('user',)

class ExpenseGroupSerializer(serializers.ModelSerializer):
    members = UserSerializer(many=True, read_only=True)
    created_by_name = serializers.CharField(source='created_by.username', read_only=True)
    total_expenses = serializers.SerializerMethodField()
    total_income = serializers.SerializerMethodField()

    class Meta:
        model = ExpenseGroup
        fields = '__all__'
        read_only_fields = ('invite_code', 'created_by')

    def get_total_expenses(self, obj):
        expenses = obj.expenses.filter(expense_type='expense')
        return sum(e.amount for e in expenses)

    def get_total_income(self, obj):
        income = obj.expenses.filter(expense_type='income')
        return sum(e.amount for e in income)

class BudgetSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    spent_amount = serializers.SerializerMethodField()

    class Meta:
        model = Budget
        fields = '__all__'
        read_only_fields = ('user',)

    def get_spent_amount(self, obj):
        expenses = Expense.objects.filter(
            user=obj.user,
            category=obj.category,
            date__gte=obj.start_date,
            date__lte=obj.end_date,
            expense_type='expense'
        )
        return sum(e.amount for e in expenses)