from django.shortcuts import render, HttpResponse, redirect
from django.contrib.auth import authenticate, login, logout
from django.views import View
from .forms import UserCreationForm, UserAuthenticationForm
from django.contrib import messages 
# Create your views here.
class SignUp(View):
    '''the signup view'''
    
    def get(self, request):
        '''returns the signup page'''
        if request.user.is_authenticated:
            return redirect('dashboard')
        
        form = UserCreationForm()
        return render(request, 'auth/pages/signup.html', {'form': form})
    
    def post(self, request):
        '''creates a new user in the db'''
        form = UserCreationForm(data=request.POST)
        if form.is_valid(): 
            user = form.save()  
            login(request, user)
            messages.success(request,'Welcome to Xpense')
            return redirect('dashboard')
        else:
            print(form.errors.get_json_data())
            for field, errors in form.errors.items():
                for error in errors:
                    messages.error(request, error)  
            return render(request, 'auth/pages/signup.html', {'form': form})
            
            
            
class SignIn(View):
    '''the signin view'''
    
    def get(self, request):
        '''returns the signin page or automatically redirects the user if already logged in'''
        
        if request.user.is_authenticated:
            return redirect('dashboard')
        
        form = UserAuthenticationForm()
        return render(request, 'auth/pages/signin.html', {'form': form})
    
    def post(self, request):
        '''creates a new user in the db'''
        form = UserAuthenticationForm(data=request.POST)
        if form.is_valid():
            username = form.cleaned_data.get('username')
            password = form.cleaned_data.get('password')
            user = authenticate(request, username=username, password=password)
            if user is not None:
                login(request, user)
                return redirect('dashboard')
            else:
                messages.error(request, 'User not found, sign up')
        for field, errors in form.errors.items():
                for error in errors:
                    messages.error(request, error)        
        return render(request, 'auth/pages/signin.html', {'form': form})

            
class Logout(View):
    '''logout'''
    
    def get(self, request):
        '''logout a user'''
        logout(request)
        return redirect('signin')
    
def not_found_404(request, exception):
    '''404 page'''
    return render(request, 'auth/pages/404.html', {}, status=404)