require 'rubygems'
require 'sinatra'
require './lib/init'

#

before do
  @path = request.env['SCRIPT_NAME']
end

match '/' do
  redirect '/'+generate_key
end

match '/:key/?' do
  if params[:key]
    @key = params[:key]
    erb :index
  else
    redirect '/'+generate_key
  end
end